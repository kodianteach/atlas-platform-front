/**
 * Unit Gateway - Abstract interface for unit operations
 */
import { Observable } from 'rxjs';
import { UnitDistributeRequest, UnitDistributeResponse, Unit, UnitDetail } from '@domain/models/unit/unit.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class UnitGateway {
  /**
   * Distribute units in bulk by range
   * @param request - Distribution parameters
   */
  abstract distributeUnits(request: UnitDistributeRequest): Observable<Result<UnitDistributeResponse>>;
  
  /**
   * Get all units for a specific organization
   * @param organizationId - The organization ID
   */
  abstract getOrganizationUnits(organizationId: number): Observable<Result<Unit[]>>;

  /**
   * Get unit detail with owners and residents
   * @param unitId - The unit ID
   */
  abstract getUnitMembers(unitId: number): Observable<Result<UnitDetail>>;
}
