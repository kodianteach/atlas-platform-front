/**
 * Onboarding Gateway - Abstract interface for onboarding operations
 * Infrastructure adapters must implement this gateway
 */
import { Observable } from 'rxjs';
import { OnboardingRequest, OnboardingResponse } from '@domain/models/onboarding/onboarding.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class OnboardingGateway {
  /**
   * Complete onboarding by creating Company and Organization
   * @param request - Onboarding data with organization details
   */
  abstract completeOnboarding(request: OnboardingRequest): Observable<Result<OnboardingResponse>>;
}
