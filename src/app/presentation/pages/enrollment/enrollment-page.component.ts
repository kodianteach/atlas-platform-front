/**
 * Enrollment Page Component
 * Orchestrates the porter device enrollment flow:
 * 1. Reads token from route param (/enroll/:token)
 * 2. Validates token via EnrollmentGateway
 * 3. Shows porter info if valid, error if invalid/consumed/expired
 * 4. On confirm, enrolls device + stores Ed25519 key in IndexedDB
 * 5. Shows success + PWA install prompt
 */
import { Component, ChangeDetectionStrategy, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthTemplateComponent } from '../../ui/templates/auth-template/auth-template.component';
import { PwaInstallModalComponent } from '../../ui/organisms/pwa-install-modal/pwa-install-modal.component';
import { EnrollmentGateway } from '@domain/gateways/enrollment/enrollment.gateway';
import { EnrollmentTokenValidation, EnrollmentResult } from '@domain/models/enrollment/enrollment.model';
import { CryptoStorageService, StoredKeyMetadata } from '@infrastructure/services/crypto-storage.service';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';
import { AuthenticationService } from '../../../services/authentication.service';

type PageState =
  | 'loading'
  | 'token-valid'
  | 'token-invalid'
  | 'token-consumed'
  | 'token-expired'
  | 'enrolling'
  | 'enrollment-success'
  | 'enrollment-error'
  | 'no-token'
  | 'already-enrolled';

@Component({
  selector: 'app-enrollment-page',
  standalone: true,
  imports: [AuthTemplateComponent, PwaInstallModalComponent],
  templateUrl: './enrollment-page.component.html',
  styleUrl: './enrollment-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnrollmentPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly enrollmentGateway = inject(EnrollmentGateway);
  private readonly cryptoStorage = inject(CryptoStorageService);
  private readonly pwaService = inject(PwaUpdateService);
  private readonly authService = inject(AuthenticationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageState = signal<PageState>('loading');
  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | undefined>(undefined);
  readonly showPwaModal = signal(false);

  /** Track which field was just copied for visual feedback */
  readonly copiedField = signal<string | null>(null);

  /** Token validation result — porter info for confirmation step */
  readonly tokenInfo = signal<EnrollmentTokenValidation | null>(null);

  /** Enrollment result — displayed on success */
  readonly enrollmentResult = signal<EnrollmentResult | null>(null);

  /** Whether the device can install the PWA */
  readonly canInstallPwa = this.pwaService.canInstall;

  /** Whether already installed as PWA */
  readonly isInstalledPwa = this.pwaService.isInstalled;

  private token = '';

  ngOnInit(): void {
    // Support both /enroll/:token (path param) and /porter-enroll?token=xxx (query param)
    this.token = this.route.snapshot.paramMap.get('token')
      || this.route.snapshot.queryParamMap.get('token')
      || '';

    if (!this.token) {
      this.pageState.set('no-token');
      return;
    }

    this.checkExistingEnrollment();
  }

  /** Confirm enrollment — called when user taps "Enrolar Dispositivo" */
  confirmEnrollment(): void {
    this.isSubmitting.set(true);
    this.generalError.set(undefined);
    this.pageState.set('enrolling');

    const platform = this.detectPlatform();
    const model = this.detectModel();
    const appVersion = '1.0.0';

    this.enrollmentGateway.enrollDevice({
      token: this.token,
      platform,
      model,
      appVersion
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      this.isSubmitting.set(false);

      if (result.success) {
        this.handleEnrollmentSuccess(result.data);
      } else {
        this.generalError.set(result.error.message);
        this.pageState.set('enrollment-error');
      }
    });
  }

  /** Retry enrollment after error */
  retryEnrollment(): void {
    this.generalError.set(undefined);
    this.confirmEnrollment();
  }

  /** Trigger PWA install prompt */
  async installPwa(): Promise<void> {
    await this.pwaService.promptInstall();
  }

  dismissPwaModal(): void {
    this.showPwaModal.set(false);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /** Navigate to doorman entry control after successful enrollment */
  goToDoorman(): void {
    const route = this.enrollmentResult()?.defaultRoute || '/doorman/entry-control';
    this.router.navigate([route]);
  }

  /** Copy text to clipboard with visual feedback */
  copyToClipboard(text: string, field: string): void {
    this.fallbackCopy(text);
    this.copiedField.set(field);
    setTimeout(() => this.copiedField.set(null), 2000);
  }

  private fallbackCopy(text: string): void {
    // Use input element for maximum compatibility (works on HTTP too)
    const input = document.createElement('input');
    input.setAttribute('value', text);
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, text.length);
    document.execCommand('copy'); // eslint-disable-line
    input.remove();
  }

  // ─── Private ───────────────────────────────────────────────

  private async checkExistingEnrollment(): Promise<void> {
    await this.cryptoStorage.initialize();

    if (this.cryptoStorage.hasStoredKey()) {
      this.pageState.set('already-enrolled');
      return;
    }

    this.validateToken();
  }

  private validateToken(): void {
    this.enrollmentGateway.validateToken(this.token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          const validation = result.data;
          if (validation.valid) {
            this.tokenInfo.set(validation);
            this.pageState.set('token-valid');
          } else {
            this.pageState.set('token-invalid');
          }
        } else {
          const code = result.error.code;
          if (code === 'TOKEN_EXPIRED') {
            this.pageState.set('token-expired');
          } else if (code === 'INVALID_TOKEN') {
            this.pageState.set('token-consumed');
          } else {
            this.generalError.set(result.error.message);
            this.pageState.set('token-invalid');
          }
        }
      });
  }

  private async handleEnrollmentSuccess(data: EnrollmentResult): Promise<void> {
    this.enrollmentResult.set(data);

    // Store Ed25519 verification key in IndexedDB
    try {
      const metadata: StoredKeyMetadata = {
        keyId: data.keyId,
        organizationName: data.organizationName,
        porterName: data.porterDisplayName,
        enrolledAt: new Date().toISOString(),
        maxClockSkewMinutes: data.maxClockSkewMinutes
      };

      await this.cryptoStorage.storeVerificationKey(data.verificationKeyJwk, metadata);
    } catch {
      console.warn('Could not store verification key in IndexedDB — offline verification may not work');
    }

    // Store JWT for automatic session if provided
    if (data.accessToken) {
      localStorage.setItem('auth_token', JSON.stringify(data.accessToken));

      // Decode JWT and store user info
      try {
        const parts = data.accessToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          const user = {
            id: payload.sub || '',
            email: payload.email || '',
            name: payload.names || data.porterDisplayName,
            role: payload.roles?.[0] || '',
            roles: payload.roles || [],
            permissions: payload.permissions || [],
            organizationId: payload.organizationId ? String(payload.organizationId) : undefined,
            defaultRoute: payload.defaultRoute || '/doorman/entry-control'
          };
          localStorage.setItem('auth_user', JSON.stringify(user));
        }
      } catch {
        console.warn('Could not decode JWT payload');
      }
    }

    this.pageState.set('enrollment-success');

    // Show PWA install modal if not already installed
    if (this.canInstallPwa() && !this.isInstalledPwa()) {
      setTimeout(() => this.showPwaModal.set(true), 500);
    }
  }

  private detectPlatform(): string {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    return 'Unknown';
  }

  private detectModel(): string {
    const ua = navigator.userAgent;
    // Try to extract device model from User Agent
    const androidMatch = ua.match(/;\s*([^;)]+)\s*Build\//);
    if (androidMatch) return androidMatch[1].trim();

    const iosMatch = ua.match(/(iPhone|iPad|iPod)/);
    if (iosMatch) return iosMatch[1];

    return navigator.platform || 'Unknown Device';
  }
}
