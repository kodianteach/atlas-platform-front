/**
 * Activation Adapter - Implements ActivationGateway for HTTP activation operations
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { ActivationGateway } from '@domain/gateways/activation/activation.gateway';
import { TokenValidationResult, ActivateRequest, ActivateResponse } from '@domain/models/activation/activation.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

/** Backend API envelope wrapper */
interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

/** Backend validate-token response shape */
interface ValidateTokenBackendData {
  valid: boolean;
  names?: string;
  email?: string;
  expiresAt?: string;
}

/** Backend activate response shape */
interface ActivateBackendData {
  userId: number;
  email: string;
  names: string;
  status: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ActivationAdapter extends ActivationGateway {
  private readonly http = inject(HttpClient);

  private readonly BASE_ENDPOINT = `${environment.apiUrl}/external/admin`;
  private readonly TIMEOUT_MS = 15000;

  override validateToken(token: string): Observable<Result<TokenValidationResult>> {
    const params = new HttpParams().set('token', token);

    return this.http.get<ApiEnvelope<ValidateTokenBackendData>>(`${this.BASE_ENDPOINT}/validate-token`, { params }).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => {
        const data = envelope.data;
        const result: TokenValidationResult = {
          valid: data.valid,
          status: data.valid ? 'VALID' : 'INVALID',
          email: data.email
        };
        return success(result);
      }),
      catchError(error => of(this.handleValidateTokenError(error)))
    );
  }

  override activate(request: ActivateRequest): Observable<Result<ActivateResponse>> {
    return this.http.post<ApiEnvelope<ActivateBackendData>>(`${this.BASE_ENDPOINT}/activate`, request).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => {
        const response: ActivateResponse = {
          activated: true,
          message: envelope.data.message || '¡Tu cuenta ha sido activada exitosamente!'
        };
        return success(response, '¡Tu cuenta ha sido activada exitosamente!');
      }),
      catchError(error => of(this.handleActivateError(error)))
    );
  }

  private handleValidateTokenError(error: unknown): Result<TokenValidationResult> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 400 || httpError.status === 404) {
      return success<TokenValidationResult>({ valid: false, status: 'INVALID' });
    }
    if (httpError.status === 410) {
      return success<TokenValidationResult>({ valid: false, status: 'EXPIRED' });
    }
    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({ code: 'NETWORK_ERROR', message: 'No se pudo conectar. Intenta de nuevo', timestamp: new Date() });
    }
    return failure({ code: 'UNKNOWN_ERROR', message: 'Ocurrió un error inesperado. Intenta de nuevo', timestamp: new Date() });
  }

  private handleActivateError(error: unknown): Result<ActivateResponse> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 400) {
      const message = httpError.error?.message || 'Los datos ingresados no son válidos';
      return failure({ code: 'VALIDATION_ERROR', message, timestamp: new Date() });
    }
    if (httpError.status === 401) {
      return failure({
        code: 'INVALID_CREDENTIALS',
        message: 'Las credenciales temporales son incorrectas. Verifica el correo y la contraseña enviados a tu email',
        timestamp: new Date()
      });
    }
    if (httpError.status === 409) {
      return failure({
        code: 'ALREADY_ACTIVATED',
        message: 'Esta cuenta ya fue activada previamente',
        timestamp: new Date()
      });
    }
    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({ code: 'NETWORK_ERROR', message: 'No se pudo conectar. Intenta de nuevo', timestamp: new Date() });
    }
    return failure({ code: 'UNKNOWN_ERROR', message: 'Ocurrió un error inesperado. Intenta de nuevo', timestamp: new Date() });
  }
}
