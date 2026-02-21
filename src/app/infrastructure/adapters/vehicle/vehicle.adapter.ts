/**
 * Vehicle Adapter - Implements VehicleGateway with mock data
 */
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VehicleGateway } from '@domain/gateways/vehicle/vehicle.gateway';
import { Vehicle } from '@domain/models/vehicle/vehicle.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class VehicleAdapter extends VehicleGateway {
  private readonly vehicles = signal<Vehicle[]>([
    {
      id: 'v1', name: 'Toyota Corolla', plate: 'ABC123', enabled: true,
      type: 'car', color: '#3498db', iconColor: '#3498db', iconBackground: '#ebf5fb'
    },
    {
      id: 'v2', name: 'Honda CB500', plate: 'XYZ789', enabled: false,
      type: 'motorcycle', color: '#e74c3c', iconColor: '#e74c3c', iconBackground: '#fdedec'
    }
  ]);

  override getVehicles(): Observable<Result<Vehicle[]>> {
    return of(success(this.vehicles())).pipe(delay(300));
  }

  override toggleVehicle(id: string, enabled: boolean): Observable<Result<Vehicle>> {
    const vehicle = this.vehicles().find(v => v.id === id);
    if (!vehicle) {
      return of(failure<Vehicle>({
        code: 'NOT_FOUND', message: 'Vehicle not found', timestamp: new Date()
      }));
    }

    const updated = { ...vehicle, enabled };
    this.vehicles.update(list => list.map(v => v.id === id ? updated : v));
    return of(success(updated)).pipe(delay(200));
  }
}
