/**
 * Login Use Case - Handles user authentication flow
 *
 * Orchestrates the login process including:
 * - Credential validation
 * - Session management
 *
 * @example
 * ```typescript
 * const result$ = this.loginUseCase.execute({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthGateway } from '@domain/gateways/auth/auth.gateway';
import { AuthCredentials, AuthSession } from '@domain/models/auth/auth.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly authGateway = inject(AuthGateway);

  /**
   * Execute login operation
   * @param credentials - User login credentials
   * @returns Observable with login result
   */
  execute(credentials: AuthCredentials): Observable<Result<AuthSession>> {
    return this.authGateway.login(credentials).pipe(
      catchError(error => of(failure<AuthSession>({
        code: 'LOGIN_ERROR',
        message: error.message || 'Unable to connect. Please try again',
        timestamp: new Date()
      })))
    );
  }
}
