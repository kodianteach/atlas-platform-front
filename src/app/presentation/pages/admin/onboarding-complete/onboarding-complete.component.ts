import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-complete',
  standalone: true,
  templateUrl: './onboarding-complete.component.html',
  styleUrl: './onboarding-complete.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingCompleteComponent {
  private readonly router = inject(Router);

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
