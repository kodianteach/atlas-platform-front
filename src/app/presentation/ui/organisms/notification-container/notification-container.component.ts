/**
 * Notification Container Component
 * Global toast notification display - stacks notifications vertically
 * Must be included in the root app.component
 *
 * @example
 * ```html
 * <app-notification-container />
 * <router-outlet />
 * ```
 */
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { GlobalNotificationService, ToastNotification } from '@infrastructure/services/global-notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (notificationService.hasNotifications()) {
      <div class="notification-container" role="alert" aria-live="polite">
        @for (notification of notificationService.notifications(); track notification.id) {
          <div class="notification-toast"
               [class]="'notification-toast--' + notification.severity"
               role="status">
            <i [class]="getIcon(notification.severity)" class="notification-icon" aria-hidden="true"></i>
            <span class="notification-message">{{ notification.message }}</span>
            <button class="notification-close"
                    (click)="dismiss(notification.id)"
                    aria-label="Close notification">
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: var(--spacing-lg, 1.5rem);
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm, 0.5rem);
      max-width: 420px;
      width: calc(100% - 2rem);
      pointer-events: none;
    }

    .notification-toast {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm, 0.5rem);
      padding: var(--spacing-md, 1rem);
      border-radius: var(--border-radius, 0.5rem);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      animation: slideDown 0.3s ease-out;
      pointer-events: auto;
      min-height: 48px;
    }

    .notification-toast--success {
      background: var(--color-success-light, #d4edda);
      border-left: 4px solid var(--color-success, #28a745);
      color: var(--color-success-dark, #1e7e34);
    }

    .notification-toast--error {
      background: var(--color-error-light, #f8d7da);
      border-left: 4px solid var(--color-error, #dc3545);
      color: var(--color-error-dark, #bd2130);
    }

    .notification-toast--warning {
      background: var(--color-warning-light, #fff3cd);
      border-left: 4px solid var(--color-warning, #ffc107);
      color: var(--color-warning-dark, #e0a800);
    }

    .notification-toast--info {
      background: #d1ecf1;
      border-left: 4px solid #17a2b8;
      color: #0c5460;
    }

    .notification-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .notification-message {
      flex: 1;
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
    }

    .notification-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: inherit;
      opacity: 0.7;
      transition: opacity 0.2s;
      min-width: auto;
      min-height: auto;
      line-height: 1;
    }

    .notification-close:hover {
      opacity: 1;
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (max-width: 480px) {
      .notification-container {
        top: var(--spacing-sm, 0.5rem);
        max-width: calc(100% - 1rem);
      }
    }
  `]
})
export class NotificationContainerComponent {
  readonly notificationService = inject(GlobalNotificationService);

  /**
   * Get the Bootstrap icon class for a notification severity
   */
  getIcon(severity: string): string {
    const icons: Record<string, string> = {
      success: 'bi bi-check-circle-fill',
      error: 'bi bi-exclamation-triangle-fill',
      warning: 'bi bi-exclamation-circle-fill',
      info: 'bi bi-info-circle-fill'
    };
    return icons[severity] || 'bi bi-info-circle-fill';
  }

  /**
   * Dismiss a notification
   */
  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
