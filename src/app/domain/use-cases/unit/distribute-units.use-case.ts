/**
 * Distribute Units Use Case
 * Handles bulk unit distribution via gateway
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { UnitGateway } from '@domain/gateways/unit/unit.gateway';
import { UnitDistributeRequest, UnitDistributeResponse } from '@domain/models/unit/unit.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class DistributeUnitsUseCase {
  private readonly unitGateway = inject(UnitGateway);

  execute(request: UnitDistributeRequest): Observable<Result<UnitDistributeResponse>> {
    return this.unitGateway.distributeUnits(request).pipe(
      catchError(error => of(failure<UnitDistributeResponse>({
        code: 'DISTRIBUTE_ERROR',
        message: error.message || 'No se pudo completar la operación. Verifica tu conexión e intenta nuevamente',
        timestamp: new Date()
      })))
    );
  }
}
