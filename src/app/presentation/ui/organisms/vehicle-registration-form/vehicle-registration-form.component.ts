import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface VehicleFormValue {
  brand: string;
  plate: string;
  color: string;
}

@Component({
  selector: 'app-vehicle-registration-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vehicle-registration-form.component.html',
  styleUrl: './vehicle-registration-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleRegistrationFormComponent {
  readonly visible = input<boolean>(false);
  readonly formSubmit = output<VehicleFormValue>();
  readonly formCancel = output<void>();

  formData: VehicleFormValue = {
    brand: '',
    plate: '',
    color: ''
  };

  readonly colors: string[] = [
    'Blanco', 'Negro', 'Gris', 'Plata', 'Rojo', 'Azul',
    'Verde', 'Amarillo', 'Naranja', 'Café', 'Beige', 'Morado'
  ];

  onSubmit(): void {
    if (this.formData.brand && this.formData.plate && this.formData.color) {
      this.formSubmit.emit({ ...this.formData });
      this.resetForm();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.formData = { brand: '', plate: '', color: '' };
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
