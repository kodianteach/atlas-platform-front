import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EntryControlService } from '../../../../services/entry-control.service';
import { QRScanResult, GateLocation } from '@domain/models/entry/entry.model';
import { AccessGrantedModalComponent } from '../../../ui/organisms/access-granted-modal/access-granted-modal.component';
import { DoormanBottomNavComponent } from '../../../ui/organisms/doorman-bottom-nav/doorman-bottom-nav.component';

@Component({
  selector: 'app-entry-control',
  standalone: true,
  imports: [DatePipe, AccessGrantedModalComponent, DoormanBottomNavComponent],
  templateUrl: './entry-control.component.html',
  styleUrl: './entry-control.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryControlComponent implements OnInit {
  private readonly entryControlService = inject(EntryControlService);
  private readonly router = inject(Router);

  readonly gateLocation = signal<GateLocation>({
    name: 'West Wing',
    wing: 'West Wing',
    gateNumber: 1
  });

  readonly scanning = signal(false);
  readonly showAccessModal = signal(false);
  readonly scanResult = signal<QRScanResult | null>(null);
  readonly recentEntry = signal<any>(null);

  ngOnInit(): void {
    this.entryControlService.currentGate$.subscribe(gate => {
      this.gateLocation.set(gate);
    });

    this.entryControlService.getEntries().subscribe(entries => {
      if (entries.length > 0) {
        this.recentEntry.set(entries[0]);
      }
    });
  }

  onScanQR(): void {
    this.scanning.set(true);

    setTimeout(() => {
      this.entryControlService.scanQRCode('mock-qr-data').subscribe(result => {
        this.scanning.set(false);
        this.scanResult.set(result);
        this.showAccessModal.set(true);
      });
    }, 1500);
  }

  onDismissModal(): void {
    this.showAccessModal.set(false);
    this.scanResult.set(null);
  }

  onOpenGate(): void {
    const result = this.scanResult();
    if (result) {
      this.entryControlService.grantAccess(result).subscribe(entry => {
        this.recentEntry.set(entry);
        this.showAccessModal.set(false);
        this.scanResult.set(null);
      });
    }
  }

  onViewLogs(): void {
    this.router.navigate(['/doorman/entry-logs']);
  }

  onSettings(): void {
    // Navigate to settings
  }
}
