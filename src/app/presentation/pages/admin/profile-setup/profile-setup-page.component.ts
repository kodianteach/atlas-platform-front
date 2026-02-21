import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProfileService } from '../../../../services/admin-profile.service';
import { ProfileSetupData } from '@domain/models/admin/admin-profile.model';
import { ProfileSetupFormComponent } from '../../../ui/organisms/profile-setup-form/profile-setup-form.component';

@Component({
  selector: 'app-profile-setup-page',
  standalone: true,
  imports: [ProfileSetupFormComponent],
  templateUrl: './profile-setup-page.component.html',
  styleUrl: './profile-setup-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSetupPageComponent implements OnInit {
  private readonly adminProfileService = inject(AdminProfileService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly generalError = signal('');
  readonly initialData = signal<ProfileSetupData | undefined>(undefined);

  ngOnInit(): void {
    this.checkProfileCompletion();
  }

  handleSubmit(data: ProfileSetupData): void {
    this.isSubmitting.set(true);
    this.generalError.set('');

    this.adminProfileService.saveProfile(data).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.router.navigate(['/admin/property-registration']);
        } else {
          this.generalError.set(response.error || 'Failed to save profile');
        }
      },
      error: (error) => this.handleError(error)
    });
  }

  handleBack(): void {
    this.router.navigate(['/login']);
  }

  private checkProfileCompletion(): void {
    this.adminProfileService.isProfileComplete().subscribe(isComplete => {
      if (isComplete) {
        this.router.navigate(['/admin/property-registration']);
      }
    });
  }

  private handleError(error: any): void {
    this.isSubmitting.set(false);
    const statusErrors: Record<number, string> = {
      0: 'Unable to connect. Please check your internet connection and try again.',
      400: error.error?.message || 'Please check your input and try again.',
      409: error.error?.message || 'This Admin ID is already registered.',
      500: 'Something went wrong on our end. Please try again later.'
    };
    this.generalError.set(statusErrors[error.status] || 'An unexpected error occurred. Please try again.');
  }
}
