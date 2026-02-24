import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models/notification.model';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly pwaUpdate = inject(PwaUpdateService);
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>(this.getDummyNotifications());
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  private readonly installNotificationId = 'pwa-install';

  constructor() {
    this.checkPwaInstallNotification();
  }

  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
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
    // Wait a bit for PWA service to initialize
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

  private getDummyNotifications(): Notification[] {
    return [
      {
        id: '1',
        title: 'Nueva Autorización',
        message: 'Juan Pérez ha sido autorizado para ingresar hoy a las 3:00 PM',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        read: false,
        type: 'success',
        icon: 'bi-check-circle'
      },
      {
        id: '2',
        title: 'Mantenimiento Programado',
        message: 'Corte de agua programado para mañana de 9:00 AM a 12:00 PM',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        type: 'warning',
        icon: 'bi-exclamation-triangle'
      },
      {
        id: '3',
        title: 'Nuevo Anuncio',
        message: 'Reunión de residentes este sábado a las 10:00 AM en el salón comunal',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: false,
        type: 'announcement',
        icon: 'bi-megaphone'
      },
      {
        id: '4',
        title: 'Pago Confirmado',
        message: 'Tu pago de cuota de mantenimiento ha sido procesado exitosamente',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        type: 'success',
        icon: 'bi-credit-card'
      },
      {
        id: '5',
        title: 'Recordatorio',
        message: 'No olvides renovar tu sticker de parqueo antes del 30 de este mes',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true,
        type: 'info',
        icon: 'bi-info-circle'
      }
    ];
  }
}
