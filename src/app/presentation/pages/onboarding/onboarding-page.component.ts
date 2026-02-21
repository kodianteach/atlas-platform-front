/**
 * Onboarding Page Component
 * Orchestrates Company/Organization creation for newly activated admins
 * Protected by authGuard + onboardingGuard
 */
import { Component, ChangeDetectionStrategy, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthTemplateComponent } from '../../ui/templates/auth-template/auth-template.component';
import { OnboardingFormComponent, OnboardingFormData } from '../../ui/organisms/onboarding-form/onboarding-form.component';
import { CompleteOnboardingUseCase } from '@domain/use-cases/onboarding/complete-onboarding.use-case';

@Component({
  selector: 'app-onboarding-page',
  standalone: true,
  imports: [AuthTemplateComponent, OnboardingFormComponent],
  templateUrl: './onboarding-page.component.html',
  styleUrl: './onboarding-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingPageComponent {
  private readonly router = inject(Router);
  private readonly completeOnboardingUseCase = inject(CompleteOnboardingUseCase);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | undefined>(undefined);
  readonly isCompleted = signal(false);

  handleOnboarding(formData: OnboardingFormData): void {
    this.isSubmitting.set(true);
    this.generalError.set(undefined);

    this.completeOnboardingUseCase.execute({
      organizationName: formData.organizationName,
      address: formData.address,
      email: formData.email || undefined,
      nit: formData.nit,
      phone: formData.phone,
      organizationType: formData.organizationType
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      this.isSubmitting.set(false);

      if (result.success) {
        this.isCompleted.set(true);
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      } else {
        this.generalError.set(result.error.message);
      }
    });
  }
}
