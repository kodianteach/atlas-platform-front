import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enrollment-url',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrollment-url.component.html',
  styleUrl: './enrollment-url.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnrollmentUrlComponent {
  readonly enrollmentUrl = input.required<string>();
  readonly closeModal = output<void>();

  readonly copied = signal(false);

  /** Build full URL with current domain */
  readonly fullUrl = computed(() => {
    const path = this.enrollmentUrl();
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const origin = globalThis.location?.origin ?? '';
    return origin + path;
  });

  async copyUrl(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.fullUrl());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.fullUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
