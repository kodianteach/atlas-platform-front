/**
 * Activate Page Component
 * Orchestrates the activation flow:
 * 1. Reads token from query params
 * 2. Validates token via ValidateTokenUseCase
 * 3. Shows form if valid, error if invalid/consumed/expired
 * 4. On submit calls ActivateAdminUseCase
 * 5. Shows success and transitions to PWA install modal
 */
import { Component, ChangeDetectionStrategy, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthTemplateComponent } from '../../ui/templates/auth-template/auth-template.component';
import { ActivationFormComponent, ActivationFormData } from '../../ui/organisms/activation-form/activation-form.component';
import { PwaInstallModalComponent } from '../../ui/organisms/pwa-install-modal/pwa-install-modal.component';
import { ValidateTokenUseCase } from '@domain/use-cases/activation/validate-token.use-case';
import { ActivateAdminUseCase } from '@domain/use-cases/activation/activate-admin.use-case';

type PageState = 'loading' | 'token-valid' | 'token-invalid' | 'token-consumed' | 'token-expired' | 'activation-success' | 'no-token';

@Component({
  selector: 'app-activate-page',
  standalone: true,
  imports: [AuthTemplateComponent, ActivationFormComponent, PwaInstallModalComponent],
  templateUrl: './activate-page.component.html',
  styleUrl: './activate-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivatePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly validateTokenUseCase = inject(ValidateTokenUseCase);
  private readonly activateAdminUseCase = inject(ActivateAdminUseCase);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageState = signal<PageState>('loading');
  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | undefined>(undefined);
  readonly showPwaModal = signal(false);

  private token = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.pageState.set('no-token');
      return;
    }

    this.validateToken();
  }

  handleActivation(formData: ActivationFormData): void {
    this.isSubmitting.set(true);
    this.generalError.set(undefined);

    this.activateAdminUseCase.execute({
      token: this.token,
      email: formData.email,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      this.isSubmitting.set(false);

      if (result.success) {
        this.pageState.set('activation-success');
        this.showPwaModal.set(true);
      } else {
        this.generalError.set(result.error.message);
      }
    });
  }

  dismissPwaModal(): void {
    this.showPwaModal.set(false);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private validateToken(): void {
    this.validateTokenUseCase.execute(this.token).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result.success) {
        const tokenResult = result.data;
        if (tokenResult.valid) {
          this.pageState.set('token-valid');
        } else {
          switch (tokenResult.status) {
            case 'CONSUMED':
              this.pageState.set('token-consumed');
              break;
            case 'EXPIRED':
              this.pageState.set('token-expired');
              break;
            default:
              this.pageState.set('token-invalid');
          }
        }
      } else {
        this.pageState.set('token-invalid');
      }
    });
  }
}
