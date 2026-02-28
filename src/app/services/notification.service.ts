import { Injectable, inject, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval, switchMap, startWith, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Notification, BackendNotification } from '@domain/models/notification/notification.model';
import { NotificationBackendGateway } from '@domain/gateways/notification/notification.gateway';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly pwaUpdate = inject(PwaUpdateService);
  private readonly backendGateway = inject(NotificationBackendGateway);
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  private readonly installNotificationId = 'pwa-install';
  private readonly POLL_INTERVAL_MS = 30_000;
  private pollingSubscription: Subscription | null = null;

  /** Current organization ID — set by the auth context */
  private readonly currentOrgId = signal<number | null>(null);

  /** Unread count as a computed signal */
  readonly unreadCount = computed(() => {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  });

  constructor() {
    this.checkPwaInstallNotification();
  }

  /**
   * Initialize backend polling for a given organization.
   * Called from auth context after login and on home init.
   * Guards against duplicate subscriptions.
   */
  startPolling(organizationId: number): void {
    // Skip if already polling for the same org
    if (this.currentOrgId() === organizationId && this.pollingSubscription) {
      return;
    }

    // Cancel any existing polling
    this.stopPolling();
    this.currentOrgId.set(organizationId);

    this.pollingSubscription = interval(this.POLL_INTERVAL_MS).pipe(
      startWith(0),
      switchMap(() => this.loadBackendNotifications(organizationId))
    ).subscribe();
  }

  /**
   * Stop polling for notifications.
   */
  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
  }

  /**
   * Load notifications from backend and merge with local ones.
   */
  private loadBackendNotifications(organizationId: number): Observable<void> {
    return this.backendGateway.getNotifications(organizationId).pipe(
      map(result => {
        if (result.success) {
          const backendMapped = result.data.map(n => this.mapBackendToLocal(n));
          const localOnly = this.notificationsSubject.value.filter(n => 
            n.id === this.installNotificationId
          );
          this.notificationsSubject.next([...localOnly, ...backendMapped]);
        }
      }),
      catchError(() => of(undefined))
    );
  }

  /**
   * Maps a backend notification to the unified Notification interface.
   */
  private mapBackendToLocal(backend: BackendNotification): Notification {
    const iconMap: Record<string, string> = {
      'POST_PUBLISHED': 'bi-megaphone',
      'POLL_ACTIVATED': 'bi-bar-chart'
    };

    return {
      id: `backend-${backend.id}`,
      title: backend.title,
      message: backend.message,
      timestamp: new Date(backend.createdAt),
      read: backend.isRead,
      type: backend.type,
      icon: iconMap[backend.type] || 'bi-bell',
      entityType: backend.entityType ?? undefined,
      entityId: backend.entityId ?? undefined
    };
  }

  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  markAsRead(notificationId: string): void {
    // If it's a backend notification, also mark on server
    if (notificationId.startsWith('backend-')) {
      const backendId = Number(notificationId.replace('backend-', ''));
      this.backendGateway.markAsRead(backendId).subscribe();
    }

    const notifications = this.notificationsSubject.value.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => {
      if (!n.read && n.id.startsWith('backend-')) {
        const backendId = Number(n.id.replace('backend-', ''));
        this.backendGateway.markAsRead(backendId).subscribe();
      }
      return { ...n, read: true };
    });
    this.notificationsSubject.next(notifications);
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  /**
   * Handles install notification click — triggers PWA install prompt
   */
  async handleInstallClick(): Promise<void> {
    if (this.pwaUpdate.canInstall()) {
      await this.pwaUpdate.promptInstall();
    }
    this.removeNotification(this.installNotificationId);
  }

  removeNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(notifications);
  }

  /**
   * Check if PWA install notification should be shown
   */
  private checkPwaInstallNotification(): void {
    setTimeout(() => {
      if (!this.pwaUpdate.isInstalled() && !this.pwaUpdate.installDismissed()) {
        this.addInstallNotification();
      }
    }, 3000);
  }

  private addInstallNotification(): void {
    const exists = this.notificationsSubject.value.some(n => n.id === this.installNotificationId);
    if (exists) return;

    const installNotification: Notification = {
      id: this.installNotificationId,
      title: 'Instalar Atlas',
      message: 'Instala la app para acceso rápido desde tu pantalla de inicio',
      timestamp: new Date(),
      read: false,
      type: 'install',
      icon: 'bi-download'
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([installNotification, ...current]);
  }
}
