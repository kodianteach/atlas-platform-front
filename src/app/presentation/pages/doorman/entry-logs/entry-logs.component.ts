import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EntryGateway } from '@domain/gateways/entry/entry.gateway';
import { AccessEvent } from '@domain/models/entry/entry.model';
import { OfflineEventQueueService } from '@infrastructure/services/offline-event-queue.service';
import { DoormanBottomNavComponent } from '../../../ui/organisms/doorman-bottom-nav/doorman-bottom-nav.component';
import { ConnectionStatusBarComponent } from '../../../ui/atoms/connection-status-bar/connection-status-bar.component';
import { SyncStatusBadgeComponent } from '../../../ui/atoms/sync-status-badge/sync-status-badge.component';

@Component({
  selector: 'app-entry-logs',
  standalone: true,
  imports: [DatePipe, DoormanBottomNavComponent, ConnectionStatusBarComponent, SyncStatusBadgeComponent],
  templateUrl: './entry-logs.component.html',
  styleUrl: './entry-logs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryLogsComponent implements OnInit {
  private readonly entryGateway = inject(EntryGateway);
  private readonly eventQueue = inject(OfflineEventQueueService);
  private readonly router = inject(Router);

  readonly entries = signal<AccessEvent[]>([]);
  readonly pendingCount = this.eventQueue.pendingCount;
  readonly loading = signal(false);
  readonly searchQuery = signal('');
  readonly activeFilter = signal<'all' | 'VALID' | 'EXPIRED' | 'REVOKED' | 'INVALID'>('all');

  readonly filteredEntries = computed(() => {
    let filtered = [...this.entries()];
    const filter = this.activeFilter();
    if (filter !== 'all') {
      filtered = filtered.filter(entry => entry.scanResult === filter);
    }
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(entry =>
        entry.personName?.toLowerCase().includes(query) ||
        entry.personDocument?.toLowerCase().includes(query) ||
        entry.vehiclePlate?.toLowerCase().includes(query)
      );
    }
    return filtered.sort((a, b) =>
      new Date(b.scannedAt || b.syncedAt || '').getTime() - new Date(a.scannedAt || a.syncedAt || '').getTime()
    );
  });

  readonly todayEntries = computed(() =>
    this.filteredEntries().filter(entry => this.isToday(entry.scannedAt))
  );

  readonly olderEntries = computed(() =>
    this.filteredEntries().filter(entry => !this.isToday(entry.scannedAt))
  );

  ngOnInit(): void {
    this.loadEntries();
    this.eventQueue.refreshCount();
  }

  loadEntries(): void {
    this.loading.set(true);
    this.entryGateway.getAccessHistory().subscribe({
      next: (result) => {
        const data = result.success ? (result.data ?? []) : [];
        this.entries.set(data);
        this.loading.set(false);
      },
      error: () => {
        // Offline fallback — show pending queued events
        this.eventQueue.dequeueAll().then(pending => {
          this.entries.set(pending);
        });
        this.loading.set(false);
      }
    });
  }

  setFilter(filter: 'all' | 'VALID' | 'EXPIRED' | 'REVOKED' | 'INVALID'): void {
    this.activeFilter.set(filter);
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onBack(): void {
    this.router.navigate(['/doorman/entry-control']);
  }

  getStatusClass(scanResult: string): string {
    if (scanResult === 'VALID') return 'status-valid';
    if (scanResult === 'EXPIRED') return 'status-expired';
    if (scanResult === 'REVOKED' || scanResult === 'INVALID') return 'status-denied';
    return 'status-pending';
  }

  getStatusLabel(scanResult: string): string {
    const labels: Record<string, string> = {
      VALID: 'VÁLIDA',
      INVALID: 'INVÁLIDA',
      EXPIRED: 'EXPIRADA',
      REVOKED: 'REVOCADA',
      ALREADY_USED: 'YA USADA'
    };
    return labels[scanResult] ?? scanResult;
  }

  getActionIcon(action: string): string {
    return action === 'EXIT' ? 'bi-box-arrow-right' : 'bi-box-arrow-in-right';
  }

  getActionLabel(action: string): string {
    return action === 'EXIT' ? 'Salida' : 'Entrada';
  }

  private isToday(dateStr: string): boolean {
    const today = new Date();
    const entryDate = new Date(dateStr);
    return entryDate.toDateString() === today.toDateString();
  }
}
