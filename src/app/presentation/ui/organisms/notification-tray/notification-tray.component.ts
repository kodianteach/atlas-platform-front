import { Component, ChangeDetectionStrategy, input, output, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationItemComponent } from '../../molecules/notification-item/notification-item.component';
import { Notification } from '@domain/models/notification/notification.model';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-notification-tray',
  standalone: true,
  imports: [NotificationItemComponent],
  templateUrl: './notification-tray.component.html',
  styleUrl: './notification-tray.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationTrayComponent implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);

  readonly visible = input<boolean>(false);
  readonly close = output<void>();
  readonly notificationSelected = output<Notification>();

  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(notifications => {
      this.notifications.set(notifications);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onNotificationClick(notification: Notification): void {
    if (notification.type === 'install') {
      this.notificationService.handleInstallClick();
      return;
    }
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
    this.notificationSelected.emit(notification);
  }

  onMarkAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }
}
