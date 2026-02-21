import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

/**
 * Share Actions Component - Provides sharing options for authorization QR
 * HU #6 - WhatsApp share and link copy actions
 */
@Component({
  selector: 'app-share-actions',
  standalone: true,
  template: `
    <div class="share-actions">
      <button class="share-btn whatsapp" (click)="onShareWhatsApp()" type="button">
        <i class="bi bi-whatsapp"></i>
        <span>WhatsApp</span>
      </button>
      <button class="share-btn copy-link" (click)="onCopyLink()" type="button">
        <i class="bi bi-link-45deg"></i>
        <span>{{ copied ? '¡Copiado!' : 'Copiar enlace' }}</span>
      </button>
    </div>
  `,
  styles: [`
    .share-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      padding: 16px 0;
    }

    .share-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .share-btn:active {
      transform: scale(0.95);
    }

    .whatsapp {
      background: #25d366;
      color: white;
    }

    .whatsapp:hover {
      background: #1da851;
    }

    .copy-link {
      background: #e9ecef;
      color: #495057;
    }

    .copy-link:hover {
      background: #dee2e6;
    }

    .share-btn i {
      font-size: 1.125rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareActionsComponent {
  readonly shareUrl = input.required<string>();
  readonly personName = input<string>('');
  readonly shareViaWhatsApp = output<string>();
  readonly copyToClipboard = output<string>();

  copied = false;

  onShareWhatsApp(): void {
    const message = this.personName()
      ? `Hola, aquí está tu autorización de ingreso: ${this.shareUrl()}`
      : `Autorización de ingreso: ${this.shareUrl()}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    this.shareViaWhatsApp.emit(this.shareUrl());
  }

  onCopyLink(): void {
    navigator.clipboard.writeText(this.shareUrl()).then(() => {
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 2000);
    });
    this.copyToClipboard.emit(this.shareUrl());
  }
}
