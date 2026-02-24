/**
 * PWA Install Banner Component (Organism)
 * Shows a persistent bottom banner encouraging users to install the app.
 * - Android/Chrome: triggers native install prompt via beforeinstallprompt
 * - iOS/Safari: shows step-by-step instructions to "Add to Home Screen"
 * - Dismissible per session
 */
import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';

@Component({
  selector: 'app-pwa-install-banner',
  standalone: true,
  template: `
    @if (showBanner()) {
      <div class="install-banner" role="alert">
        <div class="banner-content">
          <!-- Collapsed banner -->
          @if (!showInstructions()) {
            <div class="banner-row">
              <div class="banner-icon">
                <i class="bi bi-download"></i>
              </div>
              <div class="banner-text">
                <strong>Instalar Atlas</strong>
                <span>Acceso rápido desde tu pantalla de inicio</span>
              </div>
              <div class="banner-actions">
                @if (pwaUpdate.canInstall()) {
                  <button class="btn-install" (click)="install()">
                    Instalar
                  </button>
                } @else {
                  <button class="btn-install" (click)="showInstructions.set(true)">
                    Cómo instalar
                  </button>
                }
                <button class="btn-dismiss" (click)="dismiss()" aria-label="Cerrar">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          }

          <!-- Expanded instructions (iOS / fallback) -->
          @if (showInstructions()) {
            <div class="instructions-panel">
              <div class="instructions-header">
                <strong>Instalar Atlas en tu dispositivo</strong>
                <button class="btn-dismiss" (click)="showInstructions.set(false)" aria-label="Cerrar">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>

              @if (pwaUpdate.isIOS()) {
                <!-- iOS instructions -->
                <div class="steps">
                  <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-text">
                      Toca el botón <i class="bi bi-box-arrow-up"></i> <strong>Compartir</strong> en la barra del navegador
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-text">
                      Desliza y selecciona <i class="bi bi-plus-square"></i> <strong>Agregar a pantalla de inicio</strong>
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-text">
                      Toca <strong>Agregar</strong> para confirmar
                    </div>
                  </div>
                </div>
              } @else {
                <!-- Android / Desktop Chrome instructions -->
                <div class="steps">
                  <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-text">
                      Toca el menú <i class="bi bi-three-dots-vertical"></i> del navegador (esquina superior derecha)
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-text">
                      Selecciona <i class="bi bi-phone"></i> <strong>Instalar aplicación</strong> o <strong>Agregar a pantalla de inicio</strong>
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-text">
                      Confirma tocando <strong>Instalar</strong>
                    </div>
                  </div>
                </div>
              }

              <button class="btn-got-it" (click)="dismiss()">
                Entendido
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .install-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 999;
      background: linear-gradient(135deg, #1a3a5c, #2d5a8e);
      color: white;
      padding: 0.75rem 1rem;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.4s ease-out;
    }

    .banner-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .banner-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .banner-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .banner-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .banner-text strong {
      font-size: 0.9rem;
    }

    .banner-text span {
      font-size: 0.75rem;
      opacity: 0.85;
    }

    .banner-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .btn-install {
      background: var(--color-primary, #FF8C61);
      color: white;
      border: none;
      border-radius: 50rem;
      padding: 0.5rem 1.25rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: transform 0.2s, background 0.2s;
    }

    .btn-install:hover {
      transform: scale(1.05);
      background: var(--color-primary-dark, #FF6B3D);
    }

    .btn-dismiss {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      cursor: pointer;
      padding: 0.25rem;
      line-height: 1;
    }

    .btn-dismiss:hover {
      color: white;
    }

    /* Instructions panel */
    .instructions-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .instructions-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .instructions-header strong {
      font-size: 1rem;
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .step-text {
      font-size: 0.85rem;
      line-height: 1.5;
      padding-top: 0.15rem;
    }

    .step-text i {
      font-size: 1rem;
      vertical-align: middle;
    }

    .btn-got-it {
      width: 100%;
      padding: 0.65rem;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-got-it:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PwaInstallBannerComponent {
  readonly pwaUpdate = inject(PwaUpdateService);
  readonly showInstructions = signal(false);

  readonly showBanner = computed(() =>
    (this.pwaUpdate.canInstall() || this.pwaUpdate.shouldShowInstall()) &&
    !this.pwaUpdate.isInstalled() &&
    !this.pwaUpdate.installDismissed()
  );

  async install(): Promise<void> {
    const accepted = await this.pwaUpdate.promptInstall();
    if (!accepted) {
      // User declined native prompt → show manual instructions
      this.showInstructions.set(true);
    }
  }

  dismiss(): void {
    this.pwaUpdate.dismissInstall();
    this.showInstructions.set(false);
  }
}
