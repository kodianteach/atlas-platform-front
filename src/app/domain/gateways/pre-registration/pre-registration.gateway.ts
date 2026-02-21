/**
 * Pre-Registration Gateway - Abstract interface for admin pre-registration operations
 * Infrastructure adapters must implement this gateway
 */
import { Observable } from 'rxjs';
import { PreRegisterRequest, PreRegisterResponse } from '@domain/models/pre-registration/pre-registration.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class PreRegistrationGateway {
  /**
   * Pre-register a new admin from the backoffice
   * @param request - Pre-registration data with admin details
   */
  abstract preRegister(request: PreRegisterRequest): Observable<Result<PreRegisterResponse>>;
}
