/**
 * Global Notification Service
 * Manages toast notifications across the application using Signals
 */
import { Injectable, signal, computed } from '@angular/core';

/**
 * Notification severity types
 */
export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification model
 */
export interface ToastNotification {
  id: string;
  message: string;
  severity: NotificationSeverity;
  duration: number;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class GlobalNotificationService {
  /** Internal signal for notification list */
  private readonly _notifications = signal<ToastNotification[]>([]);

  /** Public readonly signal for notifications */
  readonly notifications = computed(() => this._notifications());

  /** Check if there are any active notifications */
  readonly hasNotifications = computed(() => this._notifications().length > 0);

  /**
   * Show a success notification
   * @param message - Message to display
   * @param duration - Auto-dismiss duration in ms (default: 5000, 0 for no auto-dismiss)
   */
  success(message: string, duration = 5000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Show an error notification
   * @param message - Message to display
   * @param duration - Auto-dismiss duration in ms (default: 7000)
   */
  error(message: string, duration = 7000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Show a warning notification
   * @param message - Message to display
   * @param duration - Auto-dismiss duration in ms (default: 5000)
   */
  warning(message: string, duration = 5000): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Show an info notification
   * @param message - Message to display
   * @param duration - Auto-dismiss duration in ms (default: 5000)
   */
  info(message: string, duration = 5000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Dismiss a specific notification
   * @param id - Notification ID to dismiss
   */
  dismiss(id: string): void {
    this._notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this._notifications.set([]);
  }

  /**
   * Internal method to create and show a notification
   */
  private show(message: string, severity: NotificationSeverity, duration: number): void {
    const notification: ToastNotification = {
      id: this.generateId(),
      message,
      severity,
      duration,
      createdAt: new Date()
    };

    this._notifications.update(notifications => [...notifications, notification]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(notification.id), duration);
    }
  }

  /**
   * Generate a unique notification ID
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
