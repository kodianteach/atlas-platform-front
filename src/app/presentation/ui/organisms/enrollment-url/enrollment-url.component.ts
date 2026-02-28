import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlHelperService } from '@infrastructure/services/url-helper.service';

@Component({
  selector: 'app-enrollment-url',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrollment-url.component.html',
  styleUrl: './enrollment-url.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnrollmentUrlComponent {
  private readonly urlHelper = inject(UrlHelperService);
  
  readonly enrollmentUrl = input.required<string>();
  readonly closeModal = output<void>();

  readonly copied = signal(false);

  /** Build full URL with configured base URL or current domain */
  readonly fullUrl = computed(() => {
    const path = this.enrollmentUrl();
    // Use UrlHelperService to normalize URLs (handle tunneler URLs)
    return this.urlHelper.normalizeUrl(path) || this.urlHelper.buildUrl(path);
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
