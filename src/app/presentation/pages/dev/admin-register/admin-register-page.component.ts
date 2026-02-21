/**
 * Admin Register Page Component
 * Hidden dev page for pre-registering new admin users
 * Not listed in navigation — accessible via /dev/admin-register
 */
import { Component, ChangeDetectionStrategy, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthTemplateComponent } from '../../../ui/templates/auth-template/auth-template.component';
import { AdminRegisterFormComponent, AdminRegisterFormData } from '../../../ui/organisms/admin-register-form/admin-register-form.component';
import { PreRegisterAdminUseCase } from '@domain/use-cases/pre-registration/pre-register-admin.use-case';

@Component({
  selector: 'app-admin-register-page',
  standalone: true,
  imports: [AuthTemplateComponent, AdminRegisterFormComponent],
  templateUrl: './admin-register-page.component.html',
  styleUrl: './admin-register-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRegisterPageComponent {
  private readonly preRegisterAdminUseCase = inject(PreRegisterAdminUseCase);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | undefined>(undefined);
  readonly successMessage = signal<string | undefined>(undefined);

  handleRegister(formData: AdminRegisterFormData): void {
    this.isSubmitting.set(true);
    this.generalError.set(undefined);
    this.successMessage.set(undefined);

    this.preRegisterAdminUseCase.execute({
      fullName: formData.fullName,
      email: formData.email,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      phone: formData.phone
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      this.isSubmitting.set(false);

      if (result.success) {
        this.successMessage.set(
          `Administrador pre-registrado exitosamente. Se ha enviado el correo de activación a ${formData.email}`
        );
      } else {
        this.generalError.set(result.error.message);
      }
    });
  }

  resetForm(): void {
    this.successMessage.set(undefined);
    this.generalError.set(undefined);
  }
}
