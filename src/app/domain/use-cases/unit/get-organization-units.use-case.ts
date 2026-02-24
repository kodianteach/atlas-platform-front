/**
 * Get Organization Units Use Case
 * Fetches all units for an organization
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { UnitGateway } from '@domain/gateways/unit/unit.gateway';
import { Unit } from '@domain/models/unit/unit.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class GetOrganizationUnitsUseCase {
  private readonly unitGateway = inject(UnitGateway);

  execute(organizationId: number): Observable<Result<Unit[]>> {
    return this.unitGateway.getOrganizationUnits(organizationId).pipe(
      catchError(error => of(failure<Unit[]>({
        code: 'GET_UNITS_ERROR',
        message: 'No se pudo obtener la lista de unidades',
        timestamp: new Date()
      })))
    );
  }
}
