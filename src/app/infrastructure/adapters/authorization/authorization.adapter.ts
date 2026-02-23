/**
 * Authorization Adapter - Implements AuthorizationGateway using HTTP calls
 * HU #6 - Generación de Autorizaciones con QR Firmado
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { AuthorizationGateway } from '@domain/gateways/authorization/authorization.gateway';
import { Authorization, AuthorizationFormValue, AuthorizationVerification } from '@domain/models/authorization/authorization.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

/** Backend ApiResponse shape */
interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  errorCode?: string;
  data: T;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class AuthorizationAdapter extends AuthorizationGateway {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = `${environment.apiUrl}/authorizations`;
  private readonly EXTERNAL_URL = `${environment.apiUrl}/external/authorizations`;
  private readonly TIMEOUT_MS = 15000;

  override getAuthorizations(): Observable<Result<Authorization[]>> {
    return this.http.get<ApiResponse<Authorization[]>>(this.BASE_URL).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => {
        if (response.success) {
          return success(response.data, response.message);
        }
        return failure<Authorization[]>({
          code: response.errorCode || 'GET_ERROR',
          message: response.message,
          timestamp: new Date()
        });
      }),
      catchError(error => of(this.handleError<Authorization[]>(error)))
    );
  }

  override createAuthorization(formValue: AuthorizationFormValue, document?: File): Observable<Result<Authorization>> {
    console.log('[AuthorizationAdapter] createAuthorization LLAMADO');
    console.log('[AuthorizationAdapter] URL:', this.BASE_URL);
    console.log('[AuthorizationAdapter] FormValue:', formValue);

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));

    if (document) {
      formData.append('document', document, document.name);
    }

    console.log('[AuthorizationAdapter] Enviando HTTP POST...');
    return this.http.post<ApiResponse<Authorization>>(this.BASE_URL, formData).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => {
        console.log('[AuthorizationAdapter] Respuesta recibida:', response);
        if (response.success) {
          return success(response.data, response.message);
        }
        return failure<Authorization>({
          code: response.errorCode || 'CREATE_ERROR',
          message: response.message,
          timestamp: new Date()
        });
      }),
      catchError(error => {
        console.error('[AuthorizationAdapter] Error HTTP:', error);
        return of(this.handleError<Authorization>(error));
      })
    );
  }

  override getAuthorizationById(id: number): Observable<Result<Authorization>> {
    return this.http.get<ApiResponse<Authorization>>(`${this.BASE_URL}/${id}`).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => {
        if (response.success) {
          return success(response.data, response.message);
        }
        return failure<Authorization>({
          code: response.errorCode || 'GET_BY_ID_ERROR',
          message: response.message,
          timestamp: new Date()
        });
      }),
      catchError(error => of(this.handleError<Authorization>(error)))
    );
  }

  override revokeAuthorization(id: number): Observable<Result<Authorization>> {
    return this.http.put<ApiResponse<Authorization>>(`${this.BASE_URL}/${id}/revoke`, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => {
        if (response.success) {
          return success(response.data, response.message);
        }
        return failure<Authorization>({
          code: response.errorCode || 'REVOKE_ERROR',
          message: response.message,
          timestamp: new Date()
        });
      }),
      catchError(error => of(this.handleError<Authorization>(error)))
    );
  }

  override getQrVerificationData(id: number): Observable<Result<AuthorizationVerification>> {
    return this.http.get<ApiResponse<AuthorizationVerification>>(`${this.EXTERNAL_URL}/${id}/qr-data`).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => {
        if (response.success) {
          return success(response.data, response.message);
        }
        return failure<AuthorizationVerification>({
          code: response.errorCode || 'QR_DATA_ERROR',
          message: response.message,
          timestamp: new Date()
        });
      }),
      catchError(error => of(this.handleError<AuthorizationVerification>(error)))
    );
  }

  override getQrImageUrl(id: number): string {
    return `${this.EXTERNAL_URL}/${id}/qr-image`;
  }

  private handleError<T>(error: unknown): Result<T> {
    const httpError = error as { status?: number; name?: string; error?: { message?: string; errorCode?: string } };
    const backendMessage = httpError.error?.message;

    if (httpError.status === 400) {
      return failure({ code: httpError.error?.errorCode || 'BAD_REQUEST', message: backendMessage || 'Datos inválidos', timestamp: new Date() });
    }
    if (httpError.status === 404) {
      return failure({ code: 'NOT_FOUND', message: 'Autorización no encontrada', timestamp: new Date() });
    }
    if (httpError.status === 403) {
      return failure({ code: 'FORBIDDEN', message: 'No tiene permisos para esta acción', timestamp: new Date() });
    }
    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({ code: 'NETWORK_ERROR', message: 'Error de conexión. Intente nuevamente', timestamp: new Date() });
    }
    return failure({
      code: 'UNKNOWN_ERROR',
      message: backendMessage || 'Error inesperado. Intente nuevamente',
      timestamp: new Date()
    });
  }
}
