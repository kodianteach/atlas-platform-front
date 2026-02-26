import { Component, ChangeDetectionStrategy, input, output, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Authorization } from '@domain/models/authorization/authorization.model';
import { QrDisplayComponent } from '../../molecules/qr-display/qr-display.component';
import html2canvas from 'html2canvas';

/**
 * Ticket Share Modal Component
 * Shows a ticket preview and allows sharing as image via WhatsApp
 */
@Component({
  selector: 'app-ticket-share-modal',
  standalone: true,
  imports: [CommonModule, QrDisplayComponent],
  templateUrl: './ticket-share-modal.component.html',
  styleUrl: './ticket-share-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketShareModalComponent {
  readonly authorization = input.required<Authorization>();
  readonly qrImageUrl = input<string | null>(null);
  
  readonly close = output<void>();

  @ViewChild('ticketElement', { static: false }) ticketElement!: ElementRef<HTMLDivElement>;

  isGenerating = signal(false);

  /**
   * Generates ticket image and shares via WhatsApp
   * Uses Web Share API if available, otherwise downloads the image
   */
  async onShareWhatsApp(): Promise<void> {
    if (!this.ticketElement?.nativeElement) return;

    this.isGenerating.set(true);

    try {
      // Generate canvas from ticket element
      const canvas = await html2canvas(this.ticketElement.nativeElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
          'image/jpeg',
          0.95
        );
      });

      const file = new File([blob], `pase-acceso-${this.authorization().personDocument}.jpg`, {
        type: 'image/jpeg'
      });

      // Try Web Share API (mobile)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Pase de Acceso - Atlas Platform',
          text: `Pase de acceso para ${this.authorization().personName}`
        });
      } else {
        // Fallback: download image
        this.downloadImage(canvas);
      }
    } catch (error) {
      console.error('Error generating ticket image:', error);
      // Fallback: try to download
      try {
        const canvas = await html2canvas(this.ticketElement.nativeElement, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        this.downloadImage(canvas);
      } catch {
        alert('Error al generar la imagen. Intenta de nuevo.');
      }
    } finally {
      this.isGenerating.set(false);
    }
  }

  /**
   * Downloads the ticket image as JPG
   */
  private downloadImage(canvas: HTMLCanvasElement): void {
    const link = document.createElement('a');
    link.download = `pase-acceso-${this.authorization().personDocument}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  }
}
