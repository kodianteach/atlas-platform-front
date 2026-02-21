/**
 * Activate Admin Use Case - Handles admin account activation
 *
 * Orchestrates the activation process including:
 * - Credential verification
 * - Password change
 * - Account status update
 *
 * @example
 * ```typescript
 * const result$ = this.activateAdminUseCase.execute({
 *   token: 'abc123',
 *   email: 'admin@example.com',
 *   currentPassword: 'temp123',
 *   newPassword: 'NewPass123'
 * });
 * ```
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ActivationGateway } from '@domain/gateways/activation/activation.gateway';
import { ActivateRequest, ActivateResponse } from '@domain/models/activation/activation.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class ActivateAdminUseCase {
  private readonly activationGateway = inject(ActivationGateway);

  /**
   * Execute account activation
   * @param request - Activation request with credentials and new password
   * @returns Observable with activation result
   */
  execute(request: ActivateRequest): Observable<Result<ActivateResponse>> {
    return this.activationGateway.activate(request).pipe(
      catchError(error => of(failure<ActivateResponse>({
        code: 'ACTIVATION_ERROR',
        message: error.message || 'No se pudo activar la cuenta. Intenta de nuevo',
        timestamp: new Date()
      })))
    );
  }
}
