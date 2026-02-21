/**
 * Vehicle Gateway - Abstract interface for vehicle management
 */
import { Observable } from 'rxjs';
import { Vehicle } from '@domain/models/vehicle/vehicle.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class VehicleGateway {
  /**
   * Get all vehicles for the current user
   */
  abstract getVehicles(): Observable<Result<Vehicle[]>>;

  /**
   * Toggle vehicle enabled status
   * @param id - Vehicle ID
   * @param enabled - New enabled status
   */
  abstract toggleVehicle(id: string, enabled: boolean): Observable<Result<Vehicle>>;
}
