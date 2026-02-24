/**
 * Unit Adapter - Implements UnitGateway for HTTP unit operations
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UnitGateway } from '@domain/gateways/unit/unit.gateway';
import { UnitDistributeRequest, UnitDistributeResponse, Unit } from '@domain/models/unit/unit.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class UnitAdapter extends UnitGateway {
  private readonly http = inject(HttpClient);

  private readonly DISTRIBUTE_ENDPOINT = `${environment.apiUrl}/units/distribute`;

  override distributeUnits(request: UnitDistributeRequest): Observable<Result<UnitDistributeResponse>> {
    return this.http.post<{ data: UnitDistributeResponse; message: string }>(
      this.DISTRIBUTE_ENDPOINT,
      request
    ).pipe(
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<UnitDistributeResponse>(error)))
    );
  }

  override getOrganizationUnits(organizationId: number): Observable<Result<Unit[]>> {
    const url = `${environment.apiUrl}/units/organization/${organizationId}`;
    return this.http.get<{ data: Unit[]; message?: string }>(url).pipe(
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<Unit[]>(error)))
    );
  }

  private handleError<T>(error: unknown): Result<T> {
    const httpError = error as { status?: number; error?: { message?: string } };

    if (httpError.status === 400) {
      return failure({
        code: 'VALIDATION_ERROR',
        message: httpError.error?.message || 'Error de validación',
        timestamp: new Date()
      });
    }
    if (httpError.status === 0) {
      return failure({
        code: 'NETWORK_ERROR',
        message: 'No se pudo completar la operación. Verifica tu conexión e intenta nuevamente',
        timestamp: new Date()
      });
    }
    return failure({
      code: 'SERVER_ERROR',
      message: 'No se pudo completar la operación. Verifica tu conexión e intenta nuevamente',
      timestamp: new Date()
    });
  }
}
