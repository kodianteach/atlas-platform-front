import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthorizationRecord } from '@domain/models/authorization/authorization.model';
import { AuthorizationListItemComponent } from '../../molecules/authorization-list-item/authorization-list-item.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-authorization-history',
  standalone: true,
  imports: [FormsModule, AuthorizationListItemComponent, IconComponent],
  templateUrl: './authorization-history.component.html',
  styleUrl: './authorization-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationHistoryComponent {
  readonly visible = input<boolean>(false);
  readonly records = input<AuthorizationRecord[]>([]);
  readonly close = output<void>();

  readonly searchTerm = signal('');
  readonly activeFilter = signal<'all' | 'upcoming' | 'past'>('all');

  readonly filteredRecords = computed(() => {
    let filtered = this.records();
    const term = this.searchTerm().trim().toLowerCase();

    if (term) {
      filtered = filtered.filter(record =>
        record.fullName?.toLowerCase().includes(term) ||
        record.idDocument?.toLowerCase().includes(term) ||
        (record.licensePlate && record.licensePlate.toLowerCase().includes(term))
      );
    }

    const now = new Date();
    const filter = this.activeFilter();

    if (filter === 'upcoming') {
      filtered = filtered.filter(record => {
        const visitDate = new Date(`${record.visitDate}T${record.visitTime || '00:00'}`);
        return visitDate >= now;
      });
    } else if (filter === 'past') {
      filtered = filtered.filter(record => {
        const visitDate = new Date(`${record.visitDate}T${record.visitTime || '00:00'}`);
        return visitDate < now;
      });
    }

    return [...filtered].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  setFilter(filter: 'all' | 'upcoming' | 'past'): void {
    this.activeFilter.set(filter);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onClose(): void {
    this.close.emit();
  }
}
