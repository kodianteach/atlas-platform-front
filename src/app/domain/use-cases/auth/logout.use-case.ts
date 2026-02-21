/**
 * Logout Use Case - Handles user logout flow
 */
import { Injectable, inject } from '@angular/core';
import { AuthGateway } from '@domain/gateways/auth/auth.gateway';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  private readonly authGateway = inject(AuthGateway);

  /**
   * Execute logout operation
   */
  execute(): void {
    this.authGateway.logout();
  }
}
