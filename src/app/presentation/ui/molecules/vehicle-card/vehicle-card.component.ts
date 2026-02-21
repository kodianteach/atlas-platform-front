import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Vehicle } from '@domain/models/vehicle/vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleCardComponent {
  readonly vehicle = input.required<Vehicle>();
  readonly toggleStatus = output<Vehicle>();

  onToggle(): void {
    this.toggleStatus.emit(this.vehicle());
  }
}
