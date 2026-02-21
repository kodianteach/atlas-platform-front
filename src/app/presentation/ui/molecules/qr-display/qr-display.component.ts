import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/**
 * QR Display Component - Displays a QR code image from a URL
 * Used to show the generated QR code for visitor authorizations
 */
@Component({
  selector: 'app-qr-display',
  standalone: true,
  template: `
    <div class="qr-display-container" [class.qr-loading]="loading()">
      @if (imageUrl()) {
        <img
          [src]="imageUrl()"
          [alt]="altText()"
          class="qr-image"
          (load)="onImageLoad()"
          (error)="onImageError()" />
      } @else {
        <div class="qr-placeholder">
          <i class="bi bi-qr-code"></i>
          <span>QR no disponible</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .qr-display-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 256px;
      aspect-ratio: 1;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
      border: 2px solid #e9ecef;
      margin: 0 auto;
    }

    .qr-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 8px;
    }

    .qr-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #adb5bd;
    }

    .qr-placeholder i {
      font-size: 3rem;
    }

    .qr-placeholder span {
      font-size: 0.875rem;
    }

    .qr-loading {
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrDisplayComponent {
  readonly imageUrl = input<string>('');
  readonly altText = input<string>('Código QR de autorización');
  readonly loading = input<boolean>(false);

  readonly hasImage = computed(() => !!this.imageUrl());

  onImageLoad(): void {
    // Image loaded successfully
  }

  onImageError(): void {
    // Image failed to load - placeholder will show
  }
}
