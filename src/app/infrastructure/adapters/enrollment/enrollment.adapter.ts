/**
 * Enrollment Adapter - Implements EnrollmentGateway for HTTP enrollment operations
 * Endpoints are public (no auth) under /api/external/porter/
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { EnrollmentGateway } from '@domain/gateways/enrollment/enrollment.gateway';
import {
  EnrollmentTokenValidation,
  EnrollDeviceRequest,
  EnrollmentResult
} from '@domain/models/enrollment/enrollment.model';
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

@Injectable({ providedIn: 'root' })
export class EnrollmentAdapter extends EnrollmentGateway {
  private readonly http = inject(HttpClient);

  private readonly BASE_ENDPOINT = `${environment.apiUrl}/external/porter`;
  private readonly TIMEOUT_MS = 15000;

  override validateToken(token: string): Observable<Result<EnrollmentTokenValidation>> {
    const params = new HttpParams().set('token', token);

    return this.http
      .get<ApiEnvelope<EnrollmentTokenValidation>>(`${this.BASE_ENDPOINT}/validate-token`, { params })
      .pipe(
        timeout(this.TIMEOUT_MS),
        map(envelope => success<EnrollmentTokenValidation>(envelope.data, envelope.message)),
        catchError(error => of(this.handleValidateTokenError(error)))
      );
  }

  override enrollDevice(request: EnrollDeviceRequest): Observable<Result<EnrollmentResult>> {
    return this.http
      .post<ApiEnvelope<EnrollmentResult>>(`${this.BASE_ENDPOINT}/enroll`, request)
      .pipe(
        timeout(this.TIMEOUT_MS),
        map(envelope => success<EnrollmentResult>(envelope.data, envelope.message)),
        catchError(error => of(this.handleEnrollError(error)))
      );
  }

  private handleValidateTokenError(error: unknown): Result<EnrollmentTokenValidation> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 400 || httpError.status === 404) {
      return failure({
        code: 'INVALID_TOKEN',
        message: httpError.error?.message || 'El enlace de enrolamiento no es válido',
        timestamp: new Date()
      });
    }

    if (httpError.status === 410) {
      return failure({
        code: 'TOKEN_EXPIRED',
        message: httpError.error?.message || 'El enlace de enrolamiento ha expirado',
        timestamp: new Date()
      });
    }

    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.',
        timestamp: new Date()
      });
    }

    return failure({
      code: 'UNKNOWN_ERROR',
      message: 'Ocurrió un error inesperado. Intenta de nuevo.',
      timestamp: new Date()
    });
  }

  private handleEnrollError(error: unknown): Result<EnrollmentResult> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 400) {
      return failure({
        code: 'VALIDATION_ERROR',
        message: httpError.error?.message || 'Los datos del dispositivo no son válidos',
        timestamp: new Date()
      });
    }

    if (httpError.status === 409) {
      return failure({
        code: 'ALREADY_ENROLLED',
        message: httpError.error?.message || 'Este dispositivo ya fue enrolado previamente',
        timestamp: new Date()
      });
    }

    if (httpError.status === 410) {
      return failure({
        code: 'TOKEN_CONSUMED',
        message: httpError.error?.message || 'El enlace de enrolamiento ya fue utilizado',
        timestamp: new Date()
      });
    }

    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.',
        timestamp: new Date()
      });
    }

    return failure({
      code: 'SERVER_ERROR',
      message: httpError.error?.message || 'Error del servidor. Intenta de nuevo.',
      timestamp: new Date()
    });
  }
}
