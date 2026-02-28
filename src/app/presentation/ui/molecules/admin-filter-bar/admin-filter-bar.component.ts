/**
 * AdminFilterBarComponent - Filter bar with chips for admin communications panel.
 * Supports type, status, date range, and text search filters.
 */
import { Component, ChangeDetectionStrategy, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostPollFilterParams } from '@domain/models/announcement/announcement.model';

export interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-admin-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-filter-bar.component.html',
  styleUrl: './admin-filter-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminFilterBarComponent {
  readonly filtersChange = output<PostPollFilterParams>();

  readonly typeOptions: FilterOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Anuncios', value: 'ANNOUNCEMENT' },
    { label: 'Noticias', value: 'NEWS' },
    { label: 'Publicidad', value: 'AD' },
    { label: 'Encuestas', value: 'POLL' }
  ];

  readonly statusOptions: FilterOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Borrador', value: 'DRAFT' },
    { label: 'Publicado', value: 'PUBLISHED' },
    { label: 'Archivado', value: 'ARCHIVED' }
  ];

  readonly selectedType = signal('');
  readonly selectedStatus = signal('');
  readonly searchText = signal('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');

  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedType()) count++;
    if (this.selectedStatus()) count++;
    if (this.searchText()) count++;
    if (this.dateFrom() || this.dateTo()) count++;
    return count;
  });

  onTypeChange(value: string): void {
    this.selectedType.set(value);
    this.emitFilters();
  }

  onStatusChange(value: string): void {
    this.selectedStatus.set(value);
    this.emitFilters();
  }

  onSearchChange(value: string): void {
    this.searchText.set(value);
    this.emitFilters();
  }

  onDateFromChange(value: string): void {
    this.dateFrom.set(value);
    this.emitFilters();
  }

  onDateToChange(value: string): void {
    this.dateTo.set(value);
    this.emitFilters();
  }

  clearFilters(): void {
    this.selectedType.set('');
    this.selectedStatus.set('');
    this.searchText.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.emitFilters();
  }

  private emitFilters(): void {
    const filters: PostPollFilterParams = {
      type: this.selectedType() || undefined,
      status: this.selectedStatus() || undefined,
      search: this.searchText() || undefined,
      dateFrom: this.dateFrom() ? new Date(this.dateFrom()).toISOString() : undefined,
      dateTo: this.dateTo() ? new Date(this.dateTo()).toISOString() : undefined,
      page: 0,
      size: 10
    };
    this.filtersChange.emit(filters);
  }
}
