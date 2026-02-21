import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EntryControlService } from '../../../../services/entry-control.service';
import { EntryRecord } from '@domain/models/entry/entry.model';
import { DoormanBottomNavComponent } from '../../../ui/organisms/doorman-bottom-nav/doorman-bottom-nav.component';

@Component({
  selector: 'app-entry-logs',
  standalone: true,
  imports: [DatePipe, DoormanBottomNavComponent],
  templateUrl: './entry-logs.component.html',
  styleUrl: './entry-logs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryLogsComponent implements OnInit {
  private readonly entryControlService = inject(EntryControlService);
  private readonly router = inject(Router);

  readonly entries = signal<EntryRecord[]>([]);
  readonly searchQuery = signal('');
  readonly activeFilter = signal<'all' | 'valid' | 'denied'>('all');

  readonly filteredEntries = computed(() => {
    let filtered = [...this.entries()];
    const filter = this.activeFilter();
    if (filter !== 'all') {
      filtered = filtered.filter(entry => entry.status === filter);
    }
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(entry =>
        entry.visitorName.toLowerCase().includes(query) ||
        entry.unit.toLowerCase().includes(query) ||
        entry.plate?.toLowerCase().includes(query)
      );
    }
    return filtered;
  });

  readonly todayEntries = computed(() =>
    this.filteredEntries().filter(entry => this.isToday(entry.timestamp))
  );

  readonly olderEntries = computed(() =>
    this.filteredEntries().filter(entry => !this.isToday(entry.timestamp))
  );

  ngOnInit(): void {
    this.loadEntries();
  }

  loadEntries(): void {
    this.entryControlService.getEntries().subscribe(entries => {
      this.entries.set(entries);
    });
  }

  setFilter(filter: 'all' | 'valid' | 'denied'): void {
    this.activeFilter.set(filter);
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onBack(): void {
    this.router.navigate(['/doorman/entry-control']);
  }

  private readonly statusClassMap: Record<string, string> = {
    valid: 'status-valid',
    denied: 'status-denied'
  };

  getStatusClass(status: string): string {
    return this.statusClassMap[status] ?? 'status-pending';
  }

  private readonly visitorTypeIconMap: Record<string, string> = {
    resident: 'bi-house-door-fill',
    guest: 'bi-person-fill',
    service: 'bi-wrench',
    delivery: 'bi-truck',
    unauthorized: 'bi-slash-circle'
  };

  getVisitorTypeIcon(type: string): string {
    return this.visitorTypeIconMap[type] ?? 'bi-person';
  }

  private readonly visitorTypeColorMap: Record<string, string> = {
    resident: '#3b82f6',
    guest: '#8b5cf6',
    service: '#f59e0b',
    delivery: '#ec4899',
    unauthorized: '#ef4444'
  };

  getVisitorTypeColor(type: string): string {
    return this.visitorTypeColorMap[type] ?? '#6b7280';
  }

  private readonly accessTypeLabelMap: Record<string, string> = {
    qr: 'QR Code',
    manual: 'Manual',
    'walk-in': 'Walk-in'
  };

  getAccessTypeLabel(type: string): string {
    return this.accessTypeLabelMap[type] ?? type;
  }

  private readonly visitorTypeLabelMap: Record<string, string> = {
    resident: 'Residente',
    guest: 'Invitado',
    service: 'Servicio',
    delivery: 'Entrega'
  };

  getVisitorTypeLabel(type: string): string {
    return this.visitorTypeLabelMap[type] ?? type;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    const entryDate = new Date(date);
    return entryDate.toDateString() === today.toDateString();
  }
}
