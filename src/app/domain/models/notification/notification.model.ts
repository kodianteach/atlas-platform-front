/**
 * Notification models
 */

export type NotificationType = 'info' | 'warning' | 'success' | 'announcement';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: NotificationType;
  icon?: string;
}
