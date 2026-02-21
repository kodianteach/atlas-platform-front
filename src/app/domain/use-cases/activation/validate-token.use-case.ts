/**
 * Validate Token Use Case - Validates an activation token
 *
 * Orchestrates token validation to determine if the activation
 * form should be shown or an error message displayed.
 *
 * @example
 * ```typescript
 * const result$ = this.validateTokenUseCase.execute('abc123-token');
 * ```
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ActivationGateway } from '@domain/gateways/activation/activation.gateway';
import { TokenValidationResult } from '@domain/models/activation/activation.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class ValidateTokenUseCase {
  private readonly activationGateway = inject(ActivationGateway);

  /**
   * Execute token validation
   * @param token - The activation token to validate
   * @returns Observable with validation result
   */
  execute(token: string): Observable<Result<TokenValidationResult>> {
    return this.activationGateway.validateToken(token).pipe(
      catchError(error => of(failure<TokenValidationResult>({
        code: 'TOKEN_VALIDATION_ERROR',
        message: error.message || 'No se pudo validar el token. Intenta de nuevo',
        timestamp: new Date()
      })))
    );
  }
}
