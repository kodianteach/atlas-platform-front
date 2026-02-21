/**
 * Invitation Adapter - Implements InvitationGateway for HTTP operations
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { InvitationGateway } from '@domain/gateways/invitation/invitation.gateway';
import {
  InvitationTokenValidation,
  CreateInvitationResponse,
  OwnerRegistrationRequest,
  ResidentRegistrationRequest,
  CreateResidentInvitationRequest,
  Invitation,
  InvitationFilters,
  UserLookupResult,
  UnitSearchResult
} from '@domain/models/invitation/invitation.model';
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
export class InvitationAdapter extends InvitationGateway {
  private readonly http = inject(HttpClient);

  private readonly BASE_URL = environment.apiUrl;
  private readonly TIMEOUT_MS = 15000;

  override createOwnerInvitation(): Observable<Result<CreateInvitationResponse>> {
    return this.http.post<ApiEnvelope<CreateInvitationResponse>>(
      `${this.BASE_URL}/invitations/owner`, {}
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => success(envelope.data, envelope.message)),
      catchError(error => of(this.handleError<CreateInvitationResponse>(error, 'No se pudo generar la invitación')))
    );
  }

  override createResidentInvitation(request?: CreateResidentInvitationRequest): Observable<Result<CreateInvitationResponse>> {
    return this.http.post<ApiEnvelope<CreateInvitationResponse>>(
      `${this.BASE_URL}/invitations/resident`, request || {}
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => success(envelope.data, envelope.message)),
      catchError(error => of(this.handleError<CreateInvitationResponse>(error, 'No se pudo generar la invitación')))
    );
  }

  override validateInvitationToken(token: string): Observable<Result<InvitationTokenValidation>> {
    const params = new HttpParams().set('token', token);

    return this.http.get<ApiEnvelope<InvitationTokenValidation>>(
      `${this.BASE_URL}/external/invitations/validate`, { params }
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => success(envelope.data)),
      catchError(error => of(this.handleValidateTokenError(error)))
    );
  }

  override registerOwner(request: OwnerRegistrationRequest): Observable<Result<void>> {
    return this.http.post<ApiEnvelope<unknown>>(
      `${this.BASE_URL}/external/invitations/owner/register`, request
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => success(undefined as void, envelope.message)),
      catchError(error => of(this.handleRegistrationError(error)))
    );
  }

  override registerResident(request: ResidentRegistrationRequest): Observable<Result<void>> {
    return this.http.post<ApiEnvelope<unknown>>(
      `${this.BASE_URL}/external/invitations/resident/register`, request
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => success(undefined as void, envelope.message)),
      catchError(error => of(this.handleRegistrationError(error)))
    );
  }

  override getInvitationHistory(filters: InvitationFilters): Observable<Result<Invitation[]>> {
    let params = new HttpParams();
    if (filters.type) params = params.set('type', filters.type);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.unitId) params = params.set('unitId', filters.unitId.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params = params.set('dateTo', filters.dateTo);

    return this.http.get<ApiEnvelope<Invitation[]>>(
      `${this.BASE_URL}/invitations/history`, { params }
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => success(envelope.data, envelope.message)),
      catchError(error => of(this.handleError<Invitation[]>(error, 'No se pudo obtener el historial')))
    );
  }

  override lookupUserByDocument(documentType: string, documentNumber: string): Observable<Result<UserLookupResult>> {
    const params = new HttpParams()
      .set('documentType', documentType)
      .set('documentNumber', documentNumber);

    return this.http.get<ApiEnvelope<UserLookupResult>>(
      `${this.BASE_URL}/external/users/lookup`, { params }
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => success(envelope.data)),
      catchError(() => of(success<UserLookupResult>({ found: false })))
    );
  }

  override lookupUserByEmail(email: string): Observable<Result<UserLookupResult>> {
    const params = new HttpParams().set('email', email);

    return this.http.get<ApiEnvelope<UserLookupResult>>(
      `${this.BASE_URL}/external/users/lookup-email`, { params }
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => success(envelope.data)),
      catchError(() => of(success<UserLookupResult>({ found: false })))
    );
  }

  override searchUnits(query: string): Observable<Result<UnitSearchResult[]>> {
    const params = new HttpParams().set('query', query);

    return this.http.get<ApiEnvelope<UnitSearchResult[]>>(
      `${this.BASE_URL}/units/search`, { params }
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(envelope => success(envelope.data)),
      catchError(() => of(success<UnitSearchResult[]>([])))
    );
  }

  private handleValidateTokenError(error: unknown): Result<InvitationTokenValidation> {
    const httpError = error as { status?: number; error?: { data?: InvitationTokenValidation; message?: string }; name?: string };

    if (httpError.status === 410) {
      return success<InvitationTokenValidation>({ valid: false, status: 'EXPIRED', type: 'OWNER_SELF_REGISTER', organizationId: 0 });
    }
    if (httpError.status === 409) {
      return success<InvitationTokenValidation>({ valid: false, status: 'CONSUMED', type: 'OWNER_SELF_REGISTER', organizationId: 0 });
    }
    if (httpError.status === 404) {
      return success<InvitationTokenValidation>({ valid: false, status: 'INVALID', type: 'OWNER_SELF_REGISTER', organizationId: 0 });
    }
    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({ code: 'NETWORK_ERROR', message: 'No se pudo conectar. Intenta de nuevo', timestamp: new Date() });
    }
    return failure({ code: 'UNKNOWN_ERROR', message: 'Ocurrió un error inesperado. Intenta de nuevo', timestamp: new Date() });
  }

  private handleRegistrationError(error: unknown): Result<void> {
    const httpError = error as { status?: number; error?: { message?: string; errorCode?: string }; name?: string };

    if (httpError.status === 400) {
      const message = httpError.error?.message || 'Los datos ingresados no son válidos';
      return failure({ code: httpError.error?.errorCode || 'VALIDATION_ERROR', message, timestamp: new Date() });
    }
    if (httpError.status === 410) {
      return failure({ code: 'INVITATION_EXPIRED', message: 'El enlace de invitación ha expirado', timestamp: new Date() });
    }
    if (httpError.status === 409) {
      return failure({ code: 'INVITATION_CONSUMED', message: 'Esta invitación ya fue utilizada', timestamp: new Date() });
    }
    if (httpError.status === 404) {
      return failure({ code: 'NOT_FOUND', message: 'El enlace de invitación no es válido', timestamp: new Date() });
    }
    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({ code: 'NETWORK_ERROR', message: 'No se pudo conectar. Intenta de nuevo', timestamp: new Date() });
    }
    return failure({ code: 'UNKNOWN_ERROR', message: 'Ocurrió un error inesperado. Intenta de nuevo', timestamp: new Date() });
  }

  private handleError<T>(error: unknown, defaultMessage: string): Result<T> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({ code: 'NETWORK_ERROR', message: 'No se pudo conectar. Intenta de nuevo', timestamp: new Date() });
    }
    const message = httpError.error?.message || defaultMessage;
    return failure({ code: 'API_ERROR', message, timestamp: new Date() });
  }
}
