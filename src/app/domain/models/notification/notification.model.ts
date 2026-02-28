/**
 * Notification models — aligned with backend NotificationResponse DTO.
 */

/** Local notification types (badge, PWA, etc.) */
export type LocalNotificationType = 'info' | 'warning' | 'success' | 'announcement' | 'install';

/** Backend notification types */
export type BackendNotificationType = 'POST_PUBLISHED' | 'POLL_ACTIVATED';

/** Combined type for all notification sources */
export type NotificationType = LocalNotificationType | BackendNotificationType;

/** Local notification (PWA install, frontend-only) */
export interface LocalNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: LocalNotificationType;
  icon?: string;
}

/** Backend notification response DTO */
export interface BackendNotification {
  id: number;
  organizationId: number;
  userId: number | null;
  title: string;
  message: string;
  type: BackendNotificationType;
  isRead: boolean;
  entityType: string | null;
  entityId: number | null;
  createdAt: string;
}

/** Unified notification for UI display */
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: NotificationType;
  icon?: string;
  /** For backend notifications — entity navigation */
  entityType?: string;
  entityId?: number;
}
