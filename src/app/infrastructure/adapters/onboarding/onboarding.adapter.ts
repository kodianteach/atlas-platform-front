/**
 * Onboarding Adapter - Implements OnboardingGateway for HTTP onboarding operations
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { OnboardingGateway } from '@domain/gateways/onboarding/onboarding.gateway';
import { OnboardingRequest, OnboardingResponse } from '@domain/models/onboarding/onboarding.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';
import { environment } from '@env/environment';

/** Backend API envelope wrapper */
interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

/** Backend complete-onboarding response shape */
interface OnboardingBackendData {
  companyId: number;
  companySlug: string;
  organizationId: number;
  organizationCode: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class OnboardingAdapter extends OnboardingGateway {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageGateway);

  private readonly ENDPOINT = `${environment.apiUrl}/external/admin/complete-onboarding`;
  private readonly TIMEOUT_MS = 15000;

  override completeOnboarding(request: OnboardingRequest): Observable<Result<OnboardingResponse>> {
    const user = this.storage.getItem<{ id: string }>('auth_user');
    const userId = user?.id ? Number(user.id) : null;

    const body = {
      userId,
      companyName: request.organizationName,
      companyTaxId: request.nit || null,
      companyAddress: request.address || null,
      organizationName: request.organizationName,
      organizationType: request.organizationType
    };

    return this.http.post<ApiEnvelope<OnboardingBackendData>>(this.ENDPOINT, body).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => {
        const response: OnboardingResponse = {
          completed: true,
          organizationId: String(envelope.data.organizationId),
          message: envelope.data.message || '¡Organización creada exitosamente!'
        };
        return success(response, '¡Organización creada exitosamente!');
      }),
      catchError(error => of(this.handleError(error)))
    );
  }

  private handleError(error: unknown): Result<OnboardingResponse> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 400) {
      const message = httpError.error?.message || 'Los datos ingresados no son válidos';
      return failure({ code: 'VALIDATION_ERROR', message, timestamp: new Date() });
    }
    if (httpError.status === 401) {
      return failure({ code: 'UNAUTHORIZED', message: 'Sesión expirada. Inicia sesión nuevamente', timestamp: new Date() });
    }
    if (httpError.status === 409) {
      const message = httpError.error?.message || 'El NIT ya se encuentra registrado';
      return failure({ code: 'DUPLICATE_ERROR', message, timestamp: new Date() });
    }
    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({ code: 'NETWORK_ERROR', message: 'No se pudo conectar. Intenta de nuevo', timestamp: new Date() });
    }
    return failure({ code: 'UNKNOWN_ERROR', message: 'Ocurrió un error inesperado. Intenta de nuevo', timestamp: new Date() });
  }
}
