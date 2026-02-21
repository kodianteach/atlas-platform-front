import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { BottomNavComponent } from '../../ui/organisms/bottom-nav/bottom-nav.component';
import { VehicleCardComponent } from '../../ui/molecules/vehicle-card/vehicle-card.component';
import { VehicleRegistrationFormComponent } from '../../ui/organisms/vehicle-registration-form/vehicle-registration-form.component';
import { Vehicle } from '@domain/models/vehicle/vehicle.model';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [BottomNavComponent, VehicleCardComponent, VehicleRegistrationFormComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesComponent {
  readonly showFormOverlay = signal(false);

  readonly vehicles = signal<Vehicle[]>([
    {
      id: '1',
      name: 'Tesla Model 3',
      plate: 'ABC-1234',
      enabled: true,
      type: 'car',
      iconBackground: '#FFE5E5',
      iconColor: '#FF6B6B'
    },
    {
      id: '2',
      name: 'Toyota RAV4',
      plate: 'XYZ-9876',
      enabled: true,
      type: 'car',
      iconBackground: '#E8E5FF',
      iconColor: '#7C6BFF'
    },
    {
      id: '3',
      name: 'Honda CB500',
      plate: 'MOTO-421',
      enabled: false,
      type: 'motorcycle',
      iconBackground: '#E5E5E5',
      iconColor: '#999'
    }
  ]);

  onToggleVehicle(vehicle: Vehicle): void {
    this.vehicles.update(vehicles =>
      vehicles.map(v => v.id === vehicle.id ? { ...v, enabled: !v.enabled } : v)
    );
  }

  onRegisterVehicle(): void {
    this.showFormOverlay.set(true);
  }

  onFormCancel(): void {
    this.showFormOverlay.set(false);
  }

  onFormSubmit(_formValue: any): void {
    this.showFormOverlay.set(false);
  }
}
