/**
 * Authorization Gateway - Abstract interface for visitor access authorizations
 * HU #6 - Generación de Autorizaciones con QR Firmado
 */
import { Observable } from 'rxjs';
import { Authorization, AuthorizationFormValue, AuthorizationVerification } from '@domain/models/authorization/authorization.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class AuthorizationGateway {
  /**
   * Get all authorizations for the current user (filtered by role on backend)
   */
  abstract getAuthorizations(): Observable<Result<Authorization[]>>;

  /**
   * Create a new authorization with optional identity document
   * @param formValue - Authorization form data
   * @param document - Optional PDF file of identity document
   */
  abstract createAuthorization(formValue: AuthorizationFormValue, document?: File): Observable<Result<Authorization>>;

  /**
   * Get a single authorization by ID
   * @param id - Authorization ID
   */
  abstract getAuthorizationById(id: number): Observable<Result<Authorization>>;

  /**
   * Revoke an active authorization
   * @param id - Authorization ID
   */
  abstract revokeAuthorization(id: number): Observable<Result<Authorization>>;

  /**
   * Get QR verification data (public endpoint, no auth required)
   * @param id - Authorization ID
   */
  abstract getQrVerificationData(id: number): Observable<Result<AuthorizationVerification>>;

  /**
   * Get QR image URL for an authorization (public endpoint)
   * @param id - Authorization ID
   */
  abstract getQrImageUrl(id: number): string;
}
