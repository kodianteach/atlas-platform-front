import { Component, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdminBottomNavComponent } from '../../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';
import { GetAuthorizationByIdUseCase } from '@domain/use-cases/authorization/get-authorization-by-id.use-case';
import { AuthorizationGateway } from '@domain/gateways/authorization/authorization.gateway';
import { Authorization, AuthorizationStatus, ServiceType, STATUS_LABELS, SERVICE_TYPE_LABELS } from '@domain/models/authorization/authorization.model';
import { AccessEvent, ValidationResult } from '@domain/models/entry/entry.model';

@Component({
  selector: 'app-admin-authorization-detail-page',
  standalone: true,
  imports: [CommonModule, AdminBottomNavComponent],
  templateUrl: './admin-authorization-detail-page.component.html',
  styleUrl: './admin-authorization-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAuthorizationDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly getAuthByIdUseCase = inject(GetAuthorizationByIdUseCase);
  private readonly authGateway = inject(AuthorizationGateway);
  private readonly destroyRef = inject(DestroyRef);

  readonly authorization = signal<Authorization | null>(null);
  readonly accessEvents = signal<AccessEvent[]>([]);
  readonly loading = signal(false);
  readonly loadingEvents = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showDocumentPreview = signal(false);
  readonly documentBlobUrl = signal<SafeResourceUrl | null>(null);
  readonly loadingDocument = signal(false);
  readonly documentError = signal<string | null>(null);

  private rawBlobUrl: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadAuthorization(id);
      this.loadAccessEvents(id);
    }
  }

  private loadAuthorization(id: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.getAuthByIdUseCase.execute(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.loading.set(false);
      if (result.success) {
        this.authorization.set(result.data);
      } else {
        this.errorMessage.set(result.error.message);
      }
    });
  }

  private loadAccessEvents(id: number): void {
    this.loadingEvents.set(true);

    this.authGateway.getAccessEvents(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.loadingEvents.set(false);
      if (result.success) {
        this.accessEvents.set(result.data);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/authorizations']);
  }

  getEffectiveStatus(auth: Authorization): AuthorizationStatus {
    if (auth.status === 'REVOKED') return 'REVOKED';
    if (auth.status === 'EXPIRED') return 'EXPIRED';
    const now = new Date().toISOString();
    if (now > auth.validTo) return 'EXPIRED';
    return 'ACTIVE';
  }

  getStatusLabel(auth: Authorization): string {
    return STATUS_LABELS[this.getEffectiveStatus(auth)] || auth.status;
  }

  getStatusClass(auth: Authorization): string {
    const status = this.getEffectiveStatus(auth);
    switch (status) {
      case 'ACTIVE': return 'status--active';
      case 'EXPIRED': return 'status--expired';
      case 'REVOKED': return 'status--revoked';
      default: return '';
    }
  }

  getServiceTypeLabel(type: ServiceType): string {
    return SERVICE_TYPE_LABELS[type] || type;
  }

  getServiceTypeIcon(type: ServiceType): string {
    switch (type) {
      case 'VISIT': return 'bi-person';
      case 'DELIVERY': return 'bi-box-seam';
      case 'TECHNICIAN': return 'bi-tools';
      case 'OTHER': return 'bi-three-dots';
      default: return 'bi-person';
    }
  }

  getScanResultLabel(result: ValidationResult): string {
    switch (result) {
      case 'VALID': return 'Aprobado';
      case 'INVALID': return 'Rechazado';
      case 'EXPIRED': return 'Expirado';
      case 'REVOKED': return 'Revocado';
      case 'FORMAT_ERROR': return 'Error';
      default: return result;
    }
  }

  getScanResultClass(result: ValidationResult): string {
    switch (result) {
      case 'VALID': return 'scan--valid';
      case 'INVALID': return 'scan--invalid';
      case 'EXPIRED': return 'scan--expired';
      case 'REVOKED': return 'scan--revoked';
      default: return 'scan--invalid';
    }
  }

  getScanResultIcon(result: ValidationResult): string {
    switch (result) {
      case 'VALID': return 'bi-check-circle-fill';
      case 'INVALID': return 'bi-x-circle-fill';
      case 'EXPIRED': return 'bi-clock-fill';
      case 'REVOKED': return 'bi-slash-circle-fill';
      default: return 'bi-exclamation-circle-fill';
    }
  }

  getActionLabel(action: string): string {
    return action === 'ENTRY' ? 'Ingreso' : 'Salida';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  hasDocument(): boolean {
    const auth = this.authorization();
    return !!auth?.identityDocumentKey;
  }

  onPreviewDocument(): void {
    const auth = this.authorization();
    if (!auth) return;

    this.loadingDocument.set(true);
    this.documentError.set(null);
    this.authGateway.downloadDocument(auth.id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.loadingDocument.set(false);
      if (result.success) {
        if (this.rawBlobUrl) {
          URL.revokeObjectURL(this.rawBlobUrl);
        }
        this.rawBlobUrl = URL.createObjectURL(result.data);
        this.documentBlobUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.rawBlobUrl));
        this.showDocumentPreview.set(true);
      } else {
        this.documentError.set(result.error.message || 'El documento no está disponible');
      }
    });
  }

  onDownloadDocument(): void {
    const auth = this.authorization();
    if (!auth) return;

    this.loadingDocument.set(true);
    this.documentError.set(null);
    this.authGateway.downloadDocument(auth.id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.loadingDocument.set(false);
      if (result.success) {
        const url = URL.createObjectURL(result.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `documento-identidad-${auth.personDocument}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        this.documentError.set(result.error.message || 'El documento no está disponible');
      }
    });
  }

  closeDocumentPreview(): void {
    this.showDocumentPreview.set(false);
    if (this.rawBlobUrl) {
      URL.revokeObjectURL(this.rawBlobUrl);
      this.rawBlobUrl = null;
    }
    this.documentBlobUrl.set(null);
  }

  onDismissError(): void {
    this.errorMessage.set(null);
  }
}
