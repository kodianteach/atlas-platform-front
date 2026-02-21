/**
 * Pre-Register Admin Use Case - Handles admin pre-registration from backoffice
 *
 * Orchestrates the pre-registration process including:
 * - Admin data submission
 * - User creation with PRE_REGISTERED status
 * - Activation email dispatch
 *
 * @example
 * ```typescript
 * const result$ = this.preRegisterAdminUseCase.execute({
 *   fullName: 'Juan Pérez',
 *   email: 'juan@example.com',
 *   documentType: DocumentType.CC,
 *   documentNumber: '1234567890',
 *   phone: '3001234567'
 * });
 * ```
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { PreRegistrationGateway } from '@domain/gateways/pre-registration/pre-registration.gateway';
import { PreRegisterRequest, PreRegisterResponse } from '@domain/models/pre-registration/pre-registration.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class PreRegisterAdminUseCase {
  private readonly preRegistrationGateway = inject(PreRegistrationGateway);

  /**
   * Execute admin pre-registration
   * @param request - Pre-registration data with admin details
   * @returns Observable with pre-registration result
   */
  execute(request: PreRegisterRequest): Observable<Result<PreRegisterResponse>> {
    return this.preRegistrationGateway.preRegister(request).pipe(
      catchError(error => of(failure<PreRegisterResponse>({
        code: 'PRE_REGISTRATION_ERROR',
        message: error.message || 'No se pudo pre-registrar al administrador. Intenta de nuevo',
        timestamp: new Date()
      })))
    );
  }
}
