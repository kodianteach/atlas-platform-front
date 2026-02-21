import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AuthorizationRecord } from '@domain/models/authorization/authorization.model';

@Component({
  selector: 'app-authorization-list-item',
  standalone: true,
  templateUrl: './authorization-list-item.component.html',
  styleUrl: './authorization-list-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationListItemComponent {
  readonly record = input.required<AuthorizationRecord>();
  readonly manage = output<void>();
  readonly deleted = output<void>();

  onManageClick(): void {
    this.manage.emit();
  }

  onDeleteClick(): void {
    this.deleted.emit();
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = d.getDate() === tomorrow.getDate() && d.getMonth() === tomorrow.getMonth() && d.getFullYear() === tomorrow.getFullYear();

    let datePart = '';
    if (isToday) datePart = 'Today';
    else if (isTomorrow) datePart = 'Tomorrow';
    else datePart = `${months[d.getMonth()]} ${d.getDate()}`;

    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${datePart}, ${hours}:${minutes} ${ampm}`;
  }

  getIconName(): string {
    switch (this.record().entryType) {
      case 'visitor': return 'person-fill';
      case 'courier': return 'truck-front-fill';
      case 'service': return 'wrench-adjustable-circle-fill';
      default: return 'person-fill';
    }
  }

  getIconBackground(): string {
    switch (this.record().entryType) {
      case 'visitor': return '#F3F0FF';
      case 'courier': return '#FFF8E1';
      case 'service': return '#E3F2FD';
      default: return '#F3F0FF';
    }
  }

  getIconColor(): string {
    switch (this.record().entryType) {
      case 'visitor': return '#A79BFF';
      case 'courier': return '#FFB74D';
      case 'service': return '#2196F3';
      default: return '#A79BFF';
    }
  }

  getEntryTypeLabel(): string {
    switch (this.record().entryType) {
      case 'visitor': return 'Guest';
      case 'courier': return 'Delivery';
      case 'service': return 'Service';
      default: return 'Guest';
    }
  }

  getEntryTypeBadgeClass(): string {
    switch (this.record().entryType) {
      case 'visitor': return 'badge-visitor';
      case 'courier': return 'badge-courier';
      case 'service': return 'badge-service';
      default: return 'badge-visitor';
    }
  }
}
