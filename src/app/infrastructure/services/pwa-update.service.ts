/**
 * PWA Update Service
 * Handles service worker updates, offline detection, and PWA install prompt
 * Maximizes PWA capabilities for the best mobile experience
 */
import { Injectable, inject, signal, computed, isDevMode } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { GlobalNotificationService } from '@infrastructure/services/global-notification.service';

@Injectable({ providedIn: 'root' })
export class PwaUpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly notificationService = inject(GlobalNotificationService);

  /** Whether the app is currently online */
  readonly isOnline = signal(navigator.onLine);

  /** Whether a new version is available */
  readonly updateAvailable = signal(false);

  /** Whether the app is installed as PWA */
  readonly isInstalled = signal(
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );

  /** Whether we can prompt install */
  readonly canInstall = signal(false);

  /** Deferred install prompt event */
  private deferredPrompt: Event | null = null;

  /**
   * Initialize PWA features
   * Call this from the root component constructor
   */
  initialize(): void {
    this.listenForUpdates();
    this.listenForOnlineStatus();
    this.listenForInstallPrompt();
    this.checkForUpdatesInterval();
  }

  /**
   * Apply pending update (reloads the page)
   */
  async applyUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled) return;

    try {
      await this.swUpdate.activateUpdate();
      document.location.reload();
    } catch (error) {
      if (!isDevMode()) {
        console.error('Error applying update:', error);
      }
    }
  }

  /**
   * Trigger PWA install prompt
   */
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) return false;

    const promptEvent = this.deferredPrompt as BeforeInstallPromptEvent;
    promptEvent.prompt();

    const result = await promptEvent.userChoice;
    this.deferredPrompt = null;
    this.canInstall.set(false);
    return result.outcome === 'accepted';
  }

  /**
   * Listen for service worker version updates
   */
  private listenForUpdates(): void {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.pipe(
      filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')
    ).subscribe(() => {
      this.updateAvailable.set(true);
      this.notificationService.info(
        'Nueva versión disponible. Actualice para obtener las últimas mejoras.',
        0 // Don't auto-dismiss
      );
    });

    // Handle unrecoverable state
    this.swUpdate.unrecoverable.subscribe(() => {
      this.notificationService.error(
        'Error crítico detectado. La aplicación se recargará.',
        3000
      );
      setTimeout(() => document.location.reload(), 3000);
    });
  }

  /**
   * Monitor online/offline status
   */
  private listenForOnlineStatus(): void {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      this.notificationService.success('Conexión restaurada');
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      this.notificationService.warning(
        'Sin conexión a internet. Trabajando en modo offline.',
        0
      );
    });
  }

  /**
   * Capture the beforeinstallprompt event for custom install UX
   */
  private listenForInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.canInstall.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.canInstall.set(false);
      this.deferredPrompt = null;
    });
  }

  /**
   * Periodically check for updates (every 60 seconds in production)
   */
  private checkForUpdatesInterval(): void {
    if (!this.swUpdate.isEnabled) return;

    setInterval(async () => {
      try {
        await this.swUpdate.checkForUpdate();
      } catch {
        // Silently fail - network might be unavailable
      }
    }, 60000);
  }
}

/**
 * BeforeInstallPromptEvent interface for PWA install
 */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
