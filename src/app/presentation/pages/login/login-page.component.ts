import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginTemplateComponent } from '../../ui/templates/login-template/login-template.component';
import { AuthenticationService, AuthResponse, AuthUser } from '../../../services/authentication.service';
import { AdminProfileService } from '../../../services/admin-profile.service';

interface LoginFormData {
  email: string;
  password: string;
}

interface HttpErrorLike {
  error?: string;
  status?: number;
  name?: string;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginTemplateComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly authService = inject(AuthenticationService);
  private readonly adminProfileService = inject(AdminProfileService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly generalError = signal<string | undefined>(undefined);

  handleLogin(credentials: LoginFormData): void {
    this.isSubmitting.set(true);
    this.generalError.set(undefined);

    this.authService.login(credentials).subscribe({
      next: (response: AuthResponse) => {
        if (response.success) {
          this.handleSuccess(response);
        } else {
          this.handleError(response);
        }
      },
      error: (error: HttpErrorLike) => {
        this.handleError(error);
      }
    });
  }

  private handleSuccess(response: AuthResponse): void {
    this.isSubmitting.set(false);

    const user = response.user;

    // PORTERO: redirect to doorman entry control
    if (user && this.isPorter(user)) {
      this.router.navigate(['/doorman/entry-control']);
      return;
    }

    // ADMIN_ATLAS: redirect to onboarding only if no organization yet
    if (user && this.isAdminAtlas(user)) {
      if (user.organizationId) {
        // Already completed onboarding → go to admin home
        this.router.navigate(['/home']);
      } else {
        // Needs onboarding
        this.router.navigate(['/onboarding']);
      }
      return;
    }
    
    // Check if user is an admin
    if (user?.role === 'admin') {
      // For admin users, check profile completion status
      this.adminProfileService.getProfile().subscribe({
        next: (profile) => {
          if (profile?.profileComplete) {
            // Profile is complete, redirect to appropriate dashboard
            this.router.navigate(['/home']);
          } else {
            // Profile is not complete, redirect to profile setup
            this.router.navigate(['/admin/profile-setup']);
          }
        },
        error: () => {
          // If we can't fetch profile, assume it's not complete
          this.router.navigate(['/admin/profile-setup']);
        }
      });
    } else {
      // Non-admin users go to home page
      this.router.navigate(['/home']);
    }
  }

  /**
   * Check if user has ADMIN_ATLAS role (needs onboarding)
   */
  private isAdminAtlas(user: AuthUser): boolean {
    return user.role === 'ADMIN_ATLAS' ||
      user.roles?.includes('ADMIN_ATLAS') === true;
  }

  /**
   * Check if user has a porter role (PORTERO_GENERAL or PORTERO_DELIVERY)
   */
  private isPorter(user: AuthUser): boolean {
    const porterRoles = new Set(['PORTERO_GENERAL', 'PORTERO_DELIVERY']);
    if (porterRoles.has(user.role)) return true;
    return user.roles?.some(r => porterRoles.has(r)) === true;
  }

  private handleError(error: HttpErrorLike | AuthResponse): void {
    this.isSubmitting.set(false);

    if ('success' in error && error.error) {
      // AuthResponse with error message
      this.generalError.set(error.error);
      return;
    }

    const httpError = error as HttpErrorLike;
    if (httpError.error) {
      this.generalError.set(httpError.error);
    } else if (httpError.status === 401) {
      this.generalError.set('Invalid email or password');
    } else if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      this.generalError.set('Unable to connect. Please try again');
    } else if (httpError.status === 429) {
      this.generalError.set('Too many attempts. Please try again later');
    } else {
      this.generalError.set('Something went wrong. Please try again later');
    }
  }
}
