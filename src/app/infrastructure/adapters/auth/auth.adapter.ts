/**
 * Auth Adapter - Implements AuthGateway for HTTP authentication
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { AuthGateway } from '@domain/gateways/auth/auth.gateway';
import { AuthCredentials, AuthSession, AuthResponse } from '@domain/models/auth/auth.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AuthAdapter extends AuthGateway {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageGateway);

  private readonly AUTH_ENDPOINT = `${environment.apiUrl}/auth/login`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly TIMEOUT_MS = 10000;
  private readonly RETRY_ATTEMPTS = 2;

  override login(credentials: AuthCredentials): Observable<Result<AuthSession>> {
    return this.http.post<AuthResponse>(this.AUTH_ENDPOINT, credentials).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => {
        if (response.success && response.token && response.user) {
          const session: AuthSession = {
            token: response.token,
            user: response.user
          };
          this.storeSession(session);
          return success(session, 'Login successful');
        }
        return failure<AuthSession>({
          code: 'AUTH_FAILED',
          message: response.error || 'Invalid email or password',
          timestamp: new Date()
        });
      }),
      catchError(error => of(this.handleError(error)))
    );
  }

  override logout(): void {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.USER_KEY);
  }

  override isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }

  override getToken(): string | null {
    return this.storage.getItem<string>(this.TOKEN_KEY);
  }

  private storeSession(session: AuthSession): void {
    this.storage.setItem(this.TOKEN_KEY, session.token);
    this.storage.setItem(this.USER_KEY, session.user);
  }

  private handleError(error: unknown): Result<AuthSession> {
    const httpError = error as { status?: number; name?: string };

    if (httpError.status === 401) {
      return failure({ code: 'UNAUTHORIZED', message: 'Invalid email or password', timestamp: new Date() });
    }
    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({ code: 'NETWORK_ERROR', message: 'Unable to connect. Please try again', timestamp: new Date() });
    }
    if (httpError.status === 429) {
      return failure({ code: 'RATE_LIMITED', message: 'Too many attempts. Please try again later', timestamp: new Date() });
    }
    return failure({ code: 'UNKNOWN_ERROR', message: 'Something went wrong. Please try again later', timestamp: new Date() });
  }
}
