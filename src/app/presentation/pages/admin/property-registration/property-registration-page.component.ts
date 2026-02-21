import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '../../../../services/property.service';
import { PropertyRegistrationData, PropertyRegistrationRequest } from '@domain/models/property/property.model';
import { PropertyRegistrationFormComponent } from '../../../ui/organisms/property-registration-form/property-registration-form.component';

@Component({
  selector: 'app-property-registration-page',
  standalone: true,
  imports: [PropertyRegistrationFormComponent],
  templateUrl: './property-registration-page.component.html',
  styleUrl: './property-registration-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyRegistrationPageComponent {
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);

  readonly isSubmitting = signal(false);
  readonly generalError = signal('');

  handleSubmit(data: PropertyRegistrationData): void {
    this.isSubmitting.set(true);
    this.generalError.set('');

    const request: PropertyRegistrationRequest = {
      name: data.condominiumName,
      taxId: data.taxId,
      totalUnits: data.totalUnits,
      propertyType: data.propertyType
    };

    this.propertyService.registerProperty(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/admin/onboarding/complete']);
        } else {
          this.generalError.set(response.error || 'Failed to register property');
          this.isSubmitting.set(false);
        }
      },
      error: (error) => this.handleError(error)
    });
  }

  handleBack(): void {
    this.router.navigate(['/admin/profile-setup']);
  }

  private handleError(error: any): void {
    this.isSubmitting.set(false);
    const statusErrors: Record<number, string> = {
      0: 'Unable to connect. Please check your internet connection and try again.',
      400: error.error?.message || 'Please check your input and try again.',
      409: error.error?.message || 'This Tax ID is already registered.',
      500: 'Something went wrong on our end. Please try again later.'
    };
    this.generalError.set(statusErrors[error.status] || 'An unexpected error occurred. Please try again.');
  }
}
