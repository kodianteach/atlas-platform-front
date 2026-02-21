/**
 * Auth Template Component
 * Reusable template for authentication-related screens (activation, onboarding, etc.)
 * Provides the consistent visual layout: gradient header, logo, centered card with ng-content slot
 */
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-auth-template',
  standalone: true,
  templateUrl: './auth-template.component.html',
  styleUrl: './auth-template.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthTemplateComponent {
  /** Title displayed in the card header */
  readonly title = input<string>('');
  /** Subtitle displayed below the title */
  readonly subtitle = input<string>('');
}
