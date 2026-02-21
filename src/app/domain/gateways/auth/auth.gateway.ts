/**
 * Auth Gateway - Abstract interface for authentication operations
 * Infrastructure adapters must implement this gateway
 */
import { Observable } from 'rxjs';
import { AuthCredentials, AuthResponse, AuthSession } from '@domain/models/auth/auth.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class AuthGateway {
  /**
   * Authenticate with credentials
   * @param credentials - Email and password
   */
  abstract login(credentials: AuthCredentials): Observable<Result<AuthSession>>;

  /**
   * End the current session
   */
  abstract logout(): void;

  /**
   * Check if user is authenticated
   */
  abstract isAuthenticated(): boolean;

  /**
   * Get the current auth token
   */
  abstract getToken(): string | null;
}
