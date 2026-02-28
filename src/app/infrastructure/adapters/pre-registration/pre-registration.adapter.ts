/**
 * Pre-Registration Adapter - Implements PreRegistrationGateway for HTTP pre-registration operations
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { PreRegistrationGateway } from '@domain/gateways/pre-registration/pre-registration.gateway';
import { PreRegisterRequest, PreRegisterResponse } from '@domain/models/pre-registration/pre-registration.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';
import { UrlHelperService } from '../../services/url-helper.service';

/** Backend API envelope wrapper */
interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

/** Backend pre-register response shape */
interface PreRegisterBackendData {
  userId: number;
  tokenId: number;
  email: string;
  names: string;
  expiresAt: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class PreRegistrationAdapter extends PreRegistrationGateway {
  private readonly http = inject(HttpClient);
  private readonly urlHelper = inject(UrlHelperService);

  private readonly ENDPOINT = `${environment.apiUrl}/external/admin/pre-register`;
  private readonly TIMEOUT_MS = 15000;
  private readonly OPERATOR_ID = 'atlas-backoffice';

  override preRegister(request: PreRegisterRequest): Observable<Result<PreRegisterResponse>> {
    const headers = new HttpHeaders().set('X-Operator-Id', this.OPERATOR_ID);

    const body = {
      email: request.email,
      names: request.fullName,
      documentType: request.documentType,
      documentNumber: request.documentNumber,
      phone: request.phone,
      activationBaseUrl: this.urlHelper.buildUrl('/activate')
    };

    return this.http.post<ApiEnvelope<PreRegisterBackendData>>(this.ENDPOINT, body, { headers }).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => {
        const response: PreRegisterResponse = {
          registered: true,
          email: envelope.data.email,
          message: envelope.data.message || `Administrador pre-registrado exitosamente`
        };
        return success(response, `Se ha enviado el correo de activación a ${request.email}`);
      }),
      catchError(error => of(this.handleError(error)))
    );
  }

  private handleError(error: unknown): Result<PreRegisterResponse> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 400) {
      const message = httpError.error?.message || 'Los datos ingresados no son válidos';
      return failure({ code: 'VALIDATION_ERROR', message, timestamp: new Date() });
    }
    if (httpError.status === 409) {
      const message = httpError.error?.message || 'El correo electrónico ya se encuentra registrado';
      return failure({ code: 'DUPLICATE_EMAIL', message, timestamp: new Date() });
    }
    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({ code: 'NETWORK_ERROR', message: 'No se pudo conectar. Intenta de nuevo', timestamp: new Date() });
    }
    return failure({ code: 'UNKNOWN_ERROR', message: 'Ocurrió un error inesperado. Intenta de nuevo', timestamp: new Date() });
  }
}
