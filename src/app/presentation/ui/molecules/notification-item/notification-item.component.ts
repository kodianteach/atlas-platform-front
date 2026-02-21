import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { Notification } from '@domain/models/notification/notification.model';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationItemComponent {
  readonly notification = input.required<Notification>();
  readonly notificationClick = output<Notification>();

  readonly timeAgo = computed(() => {
    const now = new Date();
    const diff = now.getTime() - this.notification().timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Ahora mismo';
  });

  onClick(): void {
    this.notificationClick.emit(this.notification());
  }
}
