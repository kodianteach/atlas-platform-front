/**
 * PWA Update Banner Component (Organism)
 * Shows a banner when a new app version is available and ready to activate.
 * The update auto-applies after 5 seconds, but user can click to apply immediately.
 */
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';

@Component({
  selector: 'app-pwa-update-banner',
  standalone: true,
  template: `
    @if (pwaUpdate.updateAvailable()) {
      <div class="update-banner" role="alert">
        <div class="banner-content">
          <i class="bi bi-arrow-repeat spin"></i>
          <span>Nueva versión disponible</span>
          <button class="btn-update" (click)="applyUpdate()">
            Actualizar ahora
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .update-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1001;
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: white;
      padding: 0.6rem 1rem;
      text-align: center;
      animation: slideDown 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .banner-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .btn-update {
      background: white;
      color: #15803d;
      border: none;
      border-radius: 50rem;
      padding: 0.35rem 1rem;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-update:hover {
      transform: scale(1.05);
    }

    .spin {
      animation: rotate 1.5s linear infinite;
    }

    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PwaUpdateBannerComponent {
  readonly pwaUpdate = inject(PwaUpdateService);

  async applyUpdate(): Promise<void> {
    await this.pwaUpdate.applyUpdate();
  }
}
