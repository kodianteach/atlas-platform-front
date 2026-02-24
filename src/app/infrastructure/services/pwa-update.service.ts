/**
 * PWA Update Service
 * Handles service worker updates, offline detection, and PWA install prompt.
 * - Auto-updates: checks periodically, auto-applies critical updates
 * - Offline: detects online/offline for doorman offline-first mode
 * - Install: captures beforeinstallprompt + iOS manual install detection
 */
import { Injectable, inject, signal, isDevMode } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { GlobalNotificationService } from '@infrastructure/services/global-notification.service';
import { environment } from '../../../environments/environment';

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
    globalThis.matchMedia('(display-mode: standalone)').matches ||
    (globalThis.navigator as unknown as { standalone?: boolean }).standalone === true
  );

  /** Whether we can prompt install (Android/Chrome) */
  readonly canInstall = signal(false);

  /** Whether user is on iOS (needs manual install instructions) */
  readonly isIOS = signal(this.detectIOS());

  /** Whether user is on Android */
  readonly isAndroid = signal(/android/i.test(navigator.userAgent));

  /** Whether the install banner should be shown (any platform) */
  readonly shouldShowInstall = signal(false);

  /** Whether the install banner was dismissed in this session */
  readonly installDismissed = signal(false);

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
    this.listenForDisplayModeChanges();
    this.detectInstallability();
  }

  /**
   * Detect if the app can be installed on this device/browser
   */
  private detectInstallability(): void {
    if (this.isInstalled()) return;

    // On iOS, always show manual instructions (no beforeinstallprompt)
    if (this.isIOS()) {
      this.shouldShowInstall.set(true);
      return;
    }

    // On Android/Chrome, wait for beforeinstallprompt (already handled)
    // If it doesn't fire within 5s and we're not installed, show manual guidance
    setTimeout(() => {
      if (!this.canInstall() && !this.isInstalled()) {
        this.shouldShowInstall.set(true);
      }
    }, 5000);
  }

  /**
   * Detect iOS device
   */
  private detectIOS(): boolean {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
  }

  /**
   * Apply pending update (reloads the page)
   */
  async applyUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled) return;

    try {
      const activated = await this.swUpdate.activateUpdate();
      if (activated) {
        document.location.reload();
      }
    } catch (error) {
      if (!isDevMode()) {
        console.error('Error applying update:', error);
      }
      // Force reload as fallback
      document.location.reload();
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
   * Dismiss the install prompt for this session
   */
  dismissInstall(): void {
    this.installDismissed.set(true);
  }

  /**
   * Listen for service worker version updates.
   * Auto-applies the update after a short delay so all devices get the latest version.
   */
  private listenForUpdates(): void {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.pipe(
      filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')
    ).subscribe(() => {
      this.updateAvailable.set(true);

      this.notificationService.info(
        'Nueva versión disponible. Actualizando...',
        5000
      );

      // Auto-apply update after 5 seconds — ensures all devices update automatically
      setTimeout(() => {
        this.applyUpdate();
      }, 5000);
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
    globalThis.addEventListener('online', () => {
      this.isOnline.set(true);
      this.notificationService.success('Conexión restaurada');
    });

    globalThis.addEventListener('offline', () => {
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
    globalThis.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.canInstall.set(true);
      this.shouldShowInstall.set(true);
    });

    globalThis.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.canInstall.set(false);
      this.deferredPrompt = null;
      this.notificationService.success('¡Atlas instalado correctamente!');
    });
  }

  /**
   * Detect when user installs PWA via display-mode change
   */
  private listenForDisplayModeChanges(): void {
    const mediaQuery = globalThis.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', (e) => {
      this.isInstalled.set(e.matches);
    });
  }

  /**
   * Periodically check for updates using environment-configured interval
   */
  private checkForUpdatesInterval(): void {
    if (!this.swUpdate.isEnabled) return;

    const interval = environment.pwa?.updateCheckInterval ?? 60000;

    // Check immediately on load
    this.swUpdate.checkForUpdate().catch(() => {});

    setInterval(async () => {
      try {
        await this.swUpdate.checkForUpdate();
      } catch {
        // Silently fail - network might be unavailable
      }
    }, interval);
  }
}

/**
 * BeforeInstallPromptEvent interface for PWA install
 */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
