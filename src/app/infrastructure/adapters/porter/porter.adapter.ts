import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { PorterGateway } from '@domain/gateways/porter/porter.gateway';
import { Porter, CreatePorterRequest, RegenerateUrlResponse } from '@domain/models/porter/porter.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

/**
 * Adaptador HTTP para operaciones de portero.
 */
@Injectable({ providedIn: 'root' })
export class PorterAdapter extends PorterGateway {
  private readonly http = inject(HttpClient);

  private readonly PORTERS_ENDPOINT = `${environment.apiUrl}/porters`;
  private readonly TIMEOUT_MS = 10000;
  private readonly RETRY_ATTEMPTS = 1;

  override createPorter(request: CreatePorterRequest): Observable<Result<Porter>> {
    return this.http.post<{ data: Porter; message: string }>(this.PORTERS_ENDPOINT, request).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success<Porter>(response.data, response.message)),
      catchError(error => of(this.handleError<Porter>(error)))
    );
  }

  override listPorters(): Observable<Result<Porter[]>> {
    return this.http.get<{ data: Porter[]; message: string }>(this.PORTERS_ENDPOINT).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success<Porter[]>(response.data, response.message)),
      catchError(error => of(this.handleError<Porter[]>(error)))
    );
  }

  override regenerateEnrollmentUrl(porterId: number): Observable<Result<RegenerateUrlResponse>> {
    const url = `${this.PORTERS_ENDPOINT}/${porterId}/regenerate-url`;
    return this.http.post<{ data: RegenerateUrlResponse; message: string }>(url, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success<RegenerateUrlResponse>(response.data, response.message)),
      catchError(error => of(this.handleError<RegenerateUrlResponse>(error)))
    );
  }

  private handleError<T>(error: unknown): Result<T> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor. Intente nuevamente.',
        timestamp: new Date()
      });
    }

    if (httpError.status === 404) {
      return failure({
        code: 'NOT_FOUND',
        message: httpError.error?.message || 'Portero no encontrado',
        timestamp: new Date()
      });
    }

    if (httpError.status === 400) {
      return failure({
        code: 'VALIDATION_ERROR',
        message: httpError.error?.message || 'Datos inválidos',
        timestamp: new Date()
      });
    }

    return failure({
      code: 'SERVER_ERROR',
      message: httpError.error?.message || 'Error del servidor. Intente nuevamente.',
      timestamp: new Date()
    });
  }
}
