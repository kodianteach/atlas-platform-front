import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, timeout, retry, map } from 'rxjs/operators';
import { ThemingService } from '@infrastructure/services/theming.service';
import { NotificationService } from './notification.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Backend login API envelope */
interface LoginApiEnvelope {
  success: boolean;
  status: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  };
  timestamp: string;
}

/** Decoded JWT payload from the backend */
export interface JwtPayload {
  sub: string;
  names: string;
  email: string;
  roles: string[];
  permissions: string[];
  modulePermissions: string[];
  organizationId?: number;
  organizationName?: string;
  enabledModules?: string[];
  defaultRoute: string;
  iss: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  roles?: string[];
  permissions?: string[];
  organizationId?: string;
  organizationName?: string;
  defaultRoute?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly AUTH_ENDPOINT = '/api/auth/login';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly TIMEOUT_MS = 10000;
  private readonly RETRY_ATTEMPTS = 2;

  constructor(private readonly http: HttpClient, private readonly themingService: ThemingService) {}

  private readonly notificationService = inject(NotificationService);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<LoginApiEnvelope>(this.AUTH_ENDPOINT, credentials).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(envelope => {
        if (envelope.success && envelope.data?.accessToken) {
          const token = envelope.data.accessToken;
          const decoded = this.decodeJwt(token);
          const user: AuthUser = {
            id: decoded?.sub || '',
            email: decoded?.email || '',
            name: decoded?.names || '',
            role: decoded?.roles?.[0] || '',
            roles: decoded?.roles || [],
            permissions: decoded?.permissions || [],
            organizationId: decoded?.organizationId ? String(decoded.organizationId) : undefined,
            organizationName: decoded?.organizationName,
            defaultRoute: decoded?.defaultRoute
          };

          this.storeToken(token);
          this.storeUser(user);
          this.themingService.loadAndApplyTheme();

          return { success: true, token, user } as AuthResponse;
        }
        return { success: false, error: envelope.message || 'Login failed' } as AuthResponse;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.notificationService.stopPolling();
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.themingService.clearTheme();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
  }

  private storeUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Decode JWT payload without verification (client-side only)
   * Uses proper UTF-8 decoding for special characters (accents, ñ, etc.)
   */
  private decodeJwt(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const bytes = Uint8Array.from(atob(payload), c => c.charCodeAt(0));
      const decoded = new TextDecoder('utf-8').decode(bytes);
      return JSON.parse(decoded) as JwtPayload;
    } catch {
      return null;
    }
  }

  private handleError(error: any): Observable<AuthResponse> {
    let errorResponse: AuthResponse;

    if (error.status === 401) {
      errorResponse = {
        success: false,
        error: 'Invalid email or password'
      };
    } else if (error.status === 0 || error.name === 'TimeoutError') {
      errorResponse = {
        success: false,
        error: 'Unable to connect. Please try again'
      };
    } else if (error.status === 429) {
      errorResponse = {
        success: false,
        error: 'Too many attempts. Please try again later'
      };
    } else {
      errorResponse = {
        success: false,
        error: 'Something went wrong. Please try again later'
      };
    }

    return of(errorResponse);
  }
}
