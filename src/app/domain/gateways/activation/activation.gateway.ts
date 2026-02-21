/**
 * Activation Gateway - Abstract interface for account activation operations
 * Infrastructure adapters must implement this gateway
 */
import { Observable } from 'rxjs';
import { TokenValidationResult, ActivateRequest, ActivateResponse } from '@domain/models/activation/activation.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class ActivationGateway {
  /**
   * Validate an activation token
   * @param token - The activation token from the URL
   */
  abstract validateToken(token: string): Observable<Result<TokenValidationResult>>;

  /**
   * Activate an admin account with new password
   * @param request - Activation request with token, email, current and new password
   */
  abstract activate(request: ActivateRequest): Observable<Result<ActivateResponse>>;
}
