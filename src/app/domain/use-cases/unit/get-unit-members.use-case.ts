/**
 * Get Unit Members Use Case
 * Fetches unit detail with owners and residents
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { UnitGateway } from '@domain/gateways/unit/unit.gateway';
import { UnitDetail } from '@domain/models/unit/unit.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class GetUnitMembersUseCase {
  private readonly unitGateway = inject(UnitGateway);

  execute(unitId: number): Observable<Result<UnitDetail>> {
    return this.unitGateway.getUnitMembers(unitId).pipe(
      catchError(() => of(failure<UnitDetail>({
        code: 'GET_UNIT_MEMBERS_ERROR',
        message: 'No se pudo obtener los miembros de la unidad',
        timestamp: new Date()
      })))
    );
  }
}
