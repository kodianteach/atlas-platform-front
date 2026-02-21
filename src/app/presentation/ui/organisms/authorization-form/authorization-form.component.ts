import { Component, ChangeDetectionStrategy, input, output, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { AuthorizationFormValue, ServiceType } from '@domain/models/authorization/authorization.model';
import { ServiceTypeSelectorComponent } from '../../molecules/service-type-selector/service-type-selector.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { TextInputComponent } from '../../atoms/text-input/text-input.component';
import { SelectInputComponent } from '../../atoms/select-input/select-input.component';
import { ButtonComponent } from '../../atoms/button/button.component';

/**
 * Authorization Form Component - Form for creating visitor authorizations
 * HU #6 - Refactored to use ServiceType, validFrom/validTo, vehicle details
 */
@Component({
  selector: 'app-authorization-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ServiceTypeSelectorComponent,
    FormFieldComponent,
    TextInputComponent,
    SelectInputComponent,
    ButtonComponent
  ],
  templateUrl: './authorization-form.component.html',
  styleUrl: './authorization-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);

  readonly visible = input<boolean>(false);
  readonly formSubmit = output<AuthorizationFormValue>();
  readonly formCancel = output<void>();
  readonly documentSelected = output<File>();

  form!: FormGroup;
  selectedDocument: File | null = null;
  private destroy$ = new Subject<void>();

  readonly vehicleTypeOptions = [
    { value: 'CAR', label: 'Automóvil' },
    { value: 'MOTORCYCLE', label: 'Motocicleta' },
    { value: 'OTHER', label: 'Otro' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultDates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setDefaultDates(): void {
    const now = new Date();
    const validFrom = this.toLocalDateTimeString(now);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const validTo = this.toLocalDateTimeString(tomorrow);
    this.form.patchValue({ validFrom, validTo });
  }

  private toLocalDateTimeString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      personName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      personDocument: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ]],
      serviceType: ['VISIT' as ServiceType, Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      unitId: [null as number | null, Validators.required],
      vehiclePlate: ['', Validators.pattern(/^[a-zA-Z0-9-]+$/)],
      vehicleType: [''],
      vehicleColor: ['']
    });
  }

  onServiceTypeChange(type: ServiceType): void {
    this.form.get('serviceType')?.setValue(type);
  }

  onDocumentFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedDocument = input.files[0];
      this.documentSelected.emit(this.selectedDocument);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const raw = this.form.value;
      const formValue: AuthorizationFormValue = {
        personName: raw.personName.trim(),
        personDocument: raw.personDocument.trim(),
        serviceType: raw.serviceType,
        validFrom: new Date(raw.validFrom).toISOString(),
        validTo: new Date(raw.validTo).toISOString(),
        unitId: raw.unitId,
        vehiclePlate: raw.vehiclePlate?.trim() || undefined,
        vehicleType: raw.vehicleType || undefined,
        vehicleColor: raw.vehicleColor?.trim() || undefined
      };

      this.formSubmit.emit(formValue);
      this.resetForm();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.formCancel.emit();
  }

  getSelectedDocument(): File | null {
    return this.selectedDocument;
  }

  private resetForm(): void {
    this.selectedDocument = null;
    this.form.reset({
      personName: '',
      personDocument: '',
      serviceType: 'VISIT',
      validFrom: '',
      validTo: '',
      unitId: null,
      vehiclePlate: '',
      vehicleType: '',
      vehicleColor: ''
    });
    this.setDefaultDates();
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control && control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return 'Campo obligatorio';
      }
      if (control.errors?.['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['pattern']) {
        if (fieldName === 'personName') return 'Solo letras y espacios';
        if (fieldName === 'personDocument') return 'Solo alfanuméricos';
        if (fieldName === 'vehiclePlate') return 'Solo alfanuméricos y guiones';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
