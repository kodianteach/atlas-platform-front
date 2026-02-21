/**
 * PWA Install Modal Component (Organism)
 * Modal that prompts users to install the PWA after account activation.
 * Uses PwaUpdateService.promptInstall() for native browser install prompt
 * and provides a "Continue in browser" option to dismiss.
 */
import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';

@Component({
  selector: 'app-pwa-install-modal',
  standalone: true,
  templateUrl: './pwa-install-modal.component.html',
  styleUrl: './pwa-install-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PwaInstallModalComponent {
  private readonly pwaUpdateService = inject(PwaUpdateService);

  readonly canInstall = this.pwaUpdateService.canInstall;
  readonly isInstalled = this.pwaUpdateService.isInstalled;

  readonly dismiss = output<void>();

  async install(): Promise<void> {
    const accepted = await this.pwaUpdateService.promptInstall();
    if (accepted) {
      this.dismiss.emit();
    }
  }

  skip(): void {
    this.dismiss.emit();
  }
}
