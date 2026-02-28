/**
 * Notification Gateway - Abstract interface for in-app notifications
 */
import { Observable } from 'rxjs';
import { BackendNotification } from '@domain/models/notification/notification.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class NotificationBackendGateway {
  /**
   * Get notifications for an organization
   */
  abstract getNotifications(organizationId: number): Observable<Result<BackendNotification[]>>;

  /**
   * Mark a notification as read
   */
  abstract markAsRead(id: number): Observable<Result<BackendNotification>>;

  /**
   * Get unread notification count
   */
  abstract getUnreadCount(organizationId: number): Observable<Result<number>>;
}
