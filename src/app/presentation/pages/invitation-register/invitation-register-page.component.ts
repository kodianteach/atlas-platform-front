/**
 * Invitation Register Page Component
 * Orchestrates the invitation registration flow:
 * 1. Reads token from query params
 * 2. Validates token via ValidateInvitationTokenUseCase
 * 3. Shows appropriate form (owner/resident) if valid
 * 4. On submit calls RegisterOwnerUseCase or RegisterResidentUseCase
 * 5. Shows success and transitions to PWA install modal
 */
import { Component, ChangeDetectionStrategy, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthTemplateComponent } from '../../ui/templates/auth-template/auth-template.component';
import { OwnerRegistrationFormComponent, OwnerRegistrationFormData } from '../../ui/organisms/owner-registration-form/owner-registration-form.component';
import { ResidentRegistrationFormComponent, ResidentRegistrationFormData } from '../../ui/organisms/resident-registration-form/resident-registration-form.component';
import { PwaInstallModalComponent } from '../../ui/organisms/pwa-install-modal/pwa-install-modal.component';
import { ValidateInvitationTokenUseCase } from '@domain/use-cases/invitation/validate-invitation-token.use-case';
import { RegisterOwnerUseCase } from '@domain/use-cases/invitation/register-owner.use-case';
import { RegisterResidentUseCase } from '@domain/use-cases/invitation/register-resident.use-case';
import { InvitationType } from '@domain/models/invitation/invitation.model';

type PageState = 'loading' | 'token-valid' | 'token-invalid' | 'token-consumed' | 'token-expired' | 'registration-success' | 'no-token';

@Component({
  selector: 'app-invitation-register-page',
  standalone: true,
  imports: [
    AuthTemplateComponent,
    OwnerRegistrationFormComponent,
    ResidentRegistrationFormComponent,
    PwaInstallModalComponent
  ],
  templateUrl: './invitation-register-page.component.html',
  styleUrl: './invitation-register-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitationRegisterPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly validateTokenUseCase = inject(ValidateInvitationTokenUseCase);
  private readonly registerOwnerUseCase = inject(RegisterOwnerUseCase);
  private readonly registerResidentUseCase = inject(RegisterResidentUseCase);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageState = signal<PageState>('loading');
  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | undefined>(undefined);
  readonly showPwaModal = signal(false);
  readonly invitationType = signal<InvitationType>('OWNER_SELF_REGISTER');

  private token = '';

  get isOwnerRegistration(): boolean {
    return this.invitationType() === 'OWNER_SELF_REGISTER' || this.invitationType() === 'OWNER';
  }

  get pageTitle(): string {
    if (this.pageState() === 'registration-success') return '¡Registro Exitoso!';
    if (this.pageState() !== 'token-valid') return 'Registro';
    return this.isOwnerRegistration ? 'Registro de Propietario' : 'Registro de Residente';
  }

  get pageSubtitle(): string {
    if (this.pageState() === 'token-valid') return 'Completa tus datos para registrarte';
    return '';
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.pageState.set('no-token');
      return;
    }

    this.validateToken();
  }

  handleOwnerRegistration(formData: OwnerRegistrationFormData): void {
    this.isSubmitting.set(true);
    this.generalError.set(undefined);

    this.registerOwnerUseCase.execute({
      token: this.token,
      names: formData.names,
      email: formData.email,
      phone: formData.phone,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      unitId: formData.unitId
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      this.isSubmitting.set(false);

      if (result.success) {
        this.pageState.set('registration-success');
        this.showPwaModal.set(true);
      } else {
        this.generalError.set(result.error.message);
      }
    });
  }

  handleResidentRegistration(formData: ResidentRegistrationFormData): void {
    this.isSubmitting.set(true);
    this.generalError.set(undefined);

    this.registerResidentUseCase.execute({
      token: this.token,
      names: formData.names,
      phone: formData.phone,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      this.isSubmitting.set(false);

      if (result.success) {
        this.pageState.set('registration-success');
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
        this.invitationType.set(tokenResult.type);

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
