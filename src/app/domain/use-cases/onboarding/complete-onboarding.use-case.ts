/**
 * Complete Onboarding Use Case - Handles admin onboarding completion
 *
 * Orchestrates the onboarding process including:
 * - Company creation
 * - Organization creation
 * - Admin association as principal administrator
 *
 * @example
 * ```typescript
 * const result$ = this.completeOnboardingUseCase.execute({
 *   organizationName: 'Mi Conjunto',
 *   address: 'Calle 1 #2-3',
 *   nit: '900123456-1',
 *   phone: '3001234567',
 *   organizationType: OrganizationType.CONJUNTO
 * });
 * ```
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { OnboardingGateway } from '@domain/gateways/onboarding/onboarding.gateway';
import { OnboardingRequest, OnboardingResponse } from '@domain/models/onboarding/onboarding.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class CompleteOnboardingUseCase {
  private readonly onboardingGateway = inject(OnboardingGateway);

  /**
   * Execute onboarding completion
   * @param request - Onboarding request with organization data
   * @returns Observable with onboarding result
   */
  execute(request: OnboardingRequest): Observable<Result<OnboardingResponse>> {
    return this.onboardingGateway.completeOnboarding(request).pipe(
      catchError(error => of(failure<OnboardingResponse>({
        code: 'ONBOARDING_ERROR',
        message: error.message || 'No se pudo completar el registro. Intenta de nuevo',
        timestamp: new Date()
      })))
    );
  }
}
