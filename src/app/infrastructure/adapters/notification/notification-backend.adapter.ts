/**
 * Notification Backend Adapter - Implements NotificationBackendGateway for HTTP operations.
 * Connects to backend /api/notifications endpoints.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { NotificationBackendGateway } from '@domain/gateways/notification/notification.gateway';
import { BackendNotification } from '@domain/models/notification/notification.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class NotificationBackendAdapter extends NotificationBackendGateway {
  private readonly http = inject(HttpClient);

  private readonly NOTIFICATIONS_ENDPOINT = `${environment.apiUrl}/notifications`;
  private readonly TIMEOUT_MS = 10000;
  private readonly RETRY_ATTEMPTS = 1;

  override getNotifications(organizationId: number): Observable<Result<BackendNotification[]>> {
    return this.http.get<{ data: BackendNotification[]; message: string }>(
      `${this.NOTIFICATIONS_ENDPOINT}/organization/${organizationId}`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<BackendNotification[]>(error)))
    );
  }

  override markAsRead(id: number): Observable<Result<BackendNotification>> {
    return this.http.post<{ data: BackendNotification; message: string }>(
      `${this.NOTIFICATIONS_ENDPOINT}/${id}/read`, {}
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<BackendNotification>(error)))
    );
  }

  override getUnreadCount(organizationId: number): Observable<Result<number>> {
    return this.http.get<{ data: number; message: string }>(
      `${this.NOTIFICATIONS_ENDPOINT}/organization/${organizationId}/unread-count`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<number>(error)))
    );
  }

  private handleError<T>(error: unknown): Result<T> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({
        code: 'NETWORK_ERROR',
        message: 'Error de conexión con el servidor',
        timestamp: new Date()
      });
    }

    return failure({
      code: `HTTP_${httpError.status || 'UNKNOWN'}`,
      message: httpError.error?.message || 'Error inesperado',
      timestamp: new Date()
    });
  }
}
