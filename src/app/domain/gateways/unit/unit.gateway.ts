/**
 * Unit Gateway - Abstract interface for unit operations
 */
import { Observable } from 'rxjs';
import { UnitDistributeRequest, UnitDistributeResponse } from '@domain/models/unit/unit.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class UnitGateway {
  /**
   * Distribute units in bulk by range
   * @param request - Distribution parameters
   */
  abstract distributeUnits(request: UnitDistributeRequest): Observable<Result<UnitDistributeResponse>>;
}
