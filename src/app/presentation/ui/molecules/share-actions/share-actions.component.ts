import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { Authorization } from '@domain/models/authorization/authorization.model';
import { TicketShareModalComponent } from '../ticket-share-modal/ticket-share-modal.component';

/**
 * Share Actions Component - Provides sharing options for authorization QR
 * HU #6 - WhatsApp share with ticket image
 * Opens a Ticket Preview Modal that generates and shares an image
 */
@Component({
  selector: 'app-share-actions',
  standalone: true,
  imports: [TicketShareModalComponent],
  template: `
    <div class="share-actions-container">
      <button class="btn-main-share" (click)="openModal()" type="button">
        <i class="bi bi-share-fill"></i>
        <span>Compartir Autorización</span>
      </button>

      @if (isModalOpen()) {
        <app-ticket-share-modal
          [authorization]="authorization()"
          [qrImageUrl]="qrImageUrl()"
          (close)="closeModal()" />
      }
    </div>
  `,
  styles: [`
    .share-actions-container {
      display: flex;
      justify-content: center;
      padding: 16px 0;
      width: 100%;
    }

    .btn-main-share {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px 24px;
      width: 100%;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      background: var(--color-primary, #B01129);
      color: white;
      box-shadow: 0 4px 12px rgba(var(--color-primary-rgb, 176, 17, 41), 0.3);
      transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    .btn-main-share:active {
      transform: scale(0.96);
      box-shadow: 0 2px 6px rgba(var(--color-primary-rgb, 176, 17, 41), 0.2);
    }

    .btn-main-share i {
      font-size: 1.1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareActionsComponent {
  readonly authorization = input.required<Authorization>();
  readonly qrImageUrl = input<string | null>(null);

  isModalOpen = signal(false);

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }
}
  
