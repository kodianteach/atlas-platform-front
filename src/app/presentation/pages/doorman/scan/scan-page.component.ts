import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { QrPayload, ValidationResult, AccessEvent, VisitorAuthorizationSummary } from '@domain/models/entry/entry.model';
import { QrParserService } from '@infrastructure/services/qr-parser.service';
import { Ed25519VerificationService } from '@infrastructure/services/ed25519-verification.service';
import { OfflineEventQueueService } from '@infrastructure/services/offline-event-queue.service';
import { RevocationCacheService } from '@infrastructure/services/revocation-cache.service';
import { EventSyncService } from '@infrastructure/services/event-sync.service';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';
import { EntryGateway } from '@domain/gateways/entry/entry.gateway';
import { QrScannerComponent } from '../../../ui/organisms/qr-scanner/qr-scanner.component';
import { ValidationResultComponent } from '../../../ui/organisms/validation-result/validation-result.component';
import { ConnectionStatusBarComponent } from '../../../ui/atoms/connection-status-bar/connection-status-bar.component';
import { SyncStatusBadgeComponent } from '../../../ui/atoms/sync-status-badge/sync-status-badge.component';
import { DoormanBottomNavComponent } from '../../../ui/organisms/doorman-bottom-nav/doorman-bottom-nav.component';

/**
 * Main scan page — orchestrates QR scan → parse → verify → validate → result.
 * Supports offline-first validation with 3 layers:
 * 1. Ed25519 signature verification (offline)
 * 2. Revocation cache check (offline)
 * 3. Online backend validation (when connected)
 */
@Component({
  selector: 'app-scan-page',
  standalone: true,
  imports: [
    DatePipe,
    QrScannerComponent,
    ValidationResultComponent,
    ConnectionStatusBarComponent,
    SyncStatusBadgeComponent,
    DoormanBottomNavComponent
  ],
  templateUrl: './scan-page.component.html',
  styleUrl: './scan-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanPageComponent implements OnInit, OnDestroy {
  private readonly qrParser = inject(QrParserService);
  private readonly ed25519 = inject(Ed25519VerificationService);
  private readonly eventQueue = inject(OfflineEventQueueService);
  private readonly revocationCache = inject(RevocationCacheService);
  private readonly eventSync = inject(EventSyncService);
  private readonly pwaUpdate = inject(PwaUpdateService);
  private readonly entryGateway = inject(EntryGateway);
  private readonly router = inject(Router);

  readonly scannerActive = signal(true);
  readonly showResult = signal(false);
  readonly validationResult = signal<ValidationResult>('VALID');
  readonly currentPayload = signal<QrPayload | null>(null);
  readonly vehicleConfirmNeeded = signal(false);
  readonly pendingCount = signal(0);

  // Cooldown to prevent re-scanning same QR
  private lastScannedQr = '';
  private lastScannedAt = 0;
  private readonly SCAN_COOLDOWN_MS = 5000;

  // Document search
  readonly documentSearchResults = signal<VisitorAuthorizationSummary[]>([]);
  readonly documentSearching = signal(false);

  ngOnInit(): void {
    this.eventSync.initialize();
    this.eventQueue.refreshCount().then(() => {
      this.pendingCount.set(this.eventQueue.pendingCount());
    });
  }

  ngOnDestroy(): void {
    this.scannerActive.set(false);
  }

  async onQrScanned(rawQr: string): Promise<void> {
    // Prevent re-scanning the same QR within cooldown period
    const now = Date.now();
    if (rawQr === this.lastScannedQr && (now - this.lastScannedAt) < this.SCAN_COOLDOWN_MS) {
      // Keep scanner stopped — it will restart after cooldown
      this.scannerActive.set(false);
      setTimeout(() => {
        if (!this.showResult()) {
          this.scannerActive.set(true);
        }
      }, this.SCAN_COOLDOWN_MS);
      return;
    }
    this.lastScannedQr = rawQr;
    this.lastScannedAt = now;

    this.scannerActive.set(false);
    console.log('[Scan] Raw QR scanned, length:', rawQr.length, 'content:', rawQr.substring(0, 100));

    // Step 1: Parse QR
    const parsed = this.qrParser.parse(rawQr);
    if (!parsed) {
      console.warn('[Scan] QR parse failed — FORMAT_ERROR');
      this.showValidationResult('FORMAT_ERROR', null);
      return;
    }

    console.log('[Scan] QR parsed OK, authId:', parsed.payload.authId);

    // Step 2: Verify Ed25519 signature (offline)
    const payloadBytes = new TextEncoder().encode(parsed.rawPayloadBase64);
    const signatureValid = await this.ed25519.verify(payloadBytes, parsed.signatureBytes);

    if (!signatureValid) {
      this.showValidationResult('INVALID', parsed.payload);
      await this.enqueueEvent(parsed.payload, 'INVALID', false);
      return;
    }

    // Step 3: Validate date range (offline)
    const dateValid = this.ed25519.isDateInRange(parsed.payload.validFrom, parsed.payload.validTo);
    if (!dateValid) {
      this.showValidationResult('EXPIRED', parsed.payload);
      await this.enqueueEvent(parsed.payload, 'EXPIRED', false);
      return;
    }

    // Step 4: Check revocation cache (offline)
    const isRevoked = await this.revocationCache.isRevoked(parsed.payload.authId);
    if (isRevoked) {
      this.showValidationResult('REVOKED', parsed.payload);
      await this.enqueueEvent(parsed.payload, 'REVOKED', false);
      return;
    }

    // Step 5: All offline checks passed — show result immediately
    // If vehicle plate exists, defer event creation until portero confirms vehicle match.
    // Otherwise, enqueue immediately.
    this.showValidResult(parsed.payload);
    if (!parsed.payload.vehiclePlate) {
      await this.enqueueEvent(parsed.payload, 'VALID', !this.pwaUpdate.isOnline());
    }
  }

  onScanError(error: string): void {
    console.error('Scan error:', error);
  }

  onConfirmEntry(): void {
    const payload = this.currentPayload();
    if (!payload) {
      this.resetScanner();
      return;
    }
    // Pass vehicleMatch=true when vehicle was confirmed, undefined when no vehicle
    const vehicleMatch = payload.vehiclePlate ? true : undefined;
    this.syncOrEnqueue(payload, 'VALID', vehicleMatch);
    this.resetScanner();
  }

  onDenyEntry(): void {
    const payload = this.currentPayload();
    if (payload) {
      this.syncOrEnqueue(payload, this.validationResult());
    }
    this.resetScanner();
  }

  onDismissResult(): void {
    this.resetScanner();
  }

  onVehicleConfirmed(matches: boolean): void {
    if (!matches) {
      // Vehicle doesn't match → reject, register and close
      const payload = this.currentPayload();
      if (payload) {
        this.syncOrEnqueue(payload, 'INVALID', false);
      }
      this.resetScanner();
      return;
    }

    // Vehicle matches → hide confirmation, show "Abrir Puerta" button
    this.vehicleConfirmNeeded.set(false);
  }

  // ═══ Document Search (manual alternative) ═══

  searchByDocument(document: string): void {
    if (!document || document.length < 3) return;
    this.documentSearching.set(true);

    this.entryGateway.findByDocument(document).subscribe({
      next: (result) => {
        this.documentSearchResults.set(result.success ? (result.data ?? []) : []);
        this.documentSearching.set(false);
      },
      error: () => {
        this.documentSearchResults.set([]);
        this.documentSearching.set(false);
      }
    });
  }

  selectAuthorization(auth: VisitorAuthorizationSummary): void {
    const payload: QrPayload = {
      authId: auth.id,
      orgId: 0,
      unitCode: auth.unitCode ?? '',
      personName: auth.personName,
      personDoc: auth.personDocument,
      serviceType: auth.serviceType,
      validFrom: auth.validFrom,
      validTo: auth.validTo,
      vehiclePlate: auth.vehiclePlate,
      vehicleType: auth.vehicleType,
      vehicleColor: auth.vehicleColor,
      issuedAt: '',
      kid: ''
    };
    this.showValidResult(payload);
  }

  // ═══ Private ═══

  private showValidResult(payload: QrPayload): void {
    if (payload.vehiclePlate) {
      this.vehicleConfirmNeeded.set(true);
    }
    this.showValidationResult('VALID', payload);
  }

  private showValidationResult(result: ValidationResult, payload: QrPayload | null): void {
    this.validationResult.set(result);
    this.currentPayload.set(payload);
    this.showResult.set(true);
  }

  private async enqueueEvent(
    payload: QrPayload,
    result: ValidationResult,
    offline: boolean,
    vehicleMatch?: boolean
  ): Promise<void> {
    const event: AccessEvent = {
      authorizationId: payload.authId,
      action: 'ENTRY',
      scanResult: result,
      personName: payload.personName,
      personDocument: payload.personDoc,
      vehiclePlate: payload.vehiclePlate,
      vehicleMatch: vehicleMatch,
      offlineValidated: offline,
      scannedAt: new Date().toISOString(),
      syncStatus: 'PENDING'
    };

    await this.eventQueue.enqueue(event);
    this.pendingCount.set(this.eventQueue.pendingCount());
  }

  /**
   * Syncs an access event to the server if online, otherwise enqueues locally.
   */
  private syncOrEnqueue(payload: QrPayload, result: ValidationResult, vehicleMatch?: boolean): void {
    const isOffline = !this.pwaUpdate.isOnline();
    const event: AccessEvent = {
      authorizationId: payload.authId,
      action: 'ENTRY',
      scanResult: result,
      personName: payload.personName,
      personDocument: payload.personDoc,
      vehiclePlate: payload.vehiclePlate,
      vehicleMatch: vehicleMatch,
      offlineValidated: isOffline,
      scannedAt: new Date().toISOString(),
      syncStatus: 'PENDING'
    };

    if (isOffline) {
      this.eventQueue.enqueue(event).then(() => {
        this.pendingCount.set(this.eventQueue.pendingCount());
      });
    } else {
      this.entryGateway.syncEvents([event]).subscribe({
        next: (res) => {
          console.log('[Scan] Event synced:', res.success, result);
          if (!res.success) {
            this.eventQueue.enqueue(event).then(() => {
              this.pendingCount.set(this.eventQueue.pendingCount());
            });
          }
        },
        error: () => {
          this.eventQueue.enqueue(event).then(() => {
            this.pendingCount.set(this.eventQueue.pendingCount());
          });
        }
      });
    }
  }

  private resetScanner(): void {
    this.showResult.set(false);
    this.currentPayload.set(null);
    this.vehicleConfirmNeeded.set(false);
    // Delay scanner restart to prevent immediate re-scan of same QR
    setTimeout(() => this.scannerActive.set(true), 1000);
  }
}
