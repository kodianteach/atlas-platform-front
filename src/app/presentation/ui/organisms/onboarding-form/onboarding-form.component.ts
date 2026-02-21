/**
 * Onboarding Form Component (Organism)
 * Reactive form for admin onboarding — Company/Organization creation
 * Fields: organizationName, address, email, nit, phone, organizationType
 */
import { Component, ChangeDetectionStrategy, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { SelectInputComponent, SelectOption } from '../../atoms/select-input/select-input.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { OrganizationType } from '@domain/models/onboarding/onboarding.model';

export interface OnboardingFormData {
  organizationName: string;
  address: string;
  email: string;
  nit: string;
  phone: string;
  organizationType: OrganizationType;
}

@Component({
  selector: 'app-onboarding-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, SelectInputComponent, ButtonComponent],
  templateUrl: './onboarding-form.component.html',
  styleUrl: './onboarding-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingFormComponent implements OnInit {
  readonly isSubmitting = input<boolean>(false);
  readonly generalError = input<string | undefined>(undefined);
  readonly submitForm = output<OnboardingFormData>();

  onboardingForm!: FormGroup;

  readonly organizationTypeOptions: SelectOption[] = [
    { value: OrganizationType.CONJUNTO, label: 'Conjunto Residencial' },
    { value: OrganizationType.CIUDADELA, label: 'Ciudadela' },
    { value: OrganizationType.CONDOMINIO, label: 'Condominio' }
  ];

  ngOnInit(): void {
    this.onboardingForm = new FormGroup({
      organizationName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      address: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [Validators.email]),
      nit: new FormControl('', [Validators.required, Validators.pattern(/^\d{9,10}(-\d)?$/)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{7,10}$/)]),
      organizationType: new FormControl('', [Validators.required])
    });
  }

  getOrganizationNameError(): string {
    const control = this.onboardingForm.get('organizationName');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'El nombre de la organización es obligatorio';
    if (control.hasError('minlength')) return 'Mínimo 3 caracteres';
    if (control.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }

  getAddressError(): string {
    const control = this.onboardingForm.get('address');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'La dirección es obligatoria';
    if (control.hasError('minlength')) return 'Mínimo 5 caracteres';
    return '';
  }

  getEmailError(): string {
    const control = this.onboardingForm.get('email');
    if (!control?.touched) return '';
    if (control.hasError('email')) return 'Ingresa un correo electrónico válido';
    return '';
  }

  getNitError(): string {
    const control = this.onboardingForm.get('nit');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'El NIT es obligatorio';
    if (control.hasError('pattern')) return 'Formato de NIT inválido (ej: 900123456-1)';
    return '';
  }

  getPhoneError(): string {
    const control = this.onboardingForm.get('phone');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'El teléfono es obligatorio';
    if (control.hasError('pattern')) return 'Número de teléfono inválido (7-10 dígitos)';
    return '';
  }

  getOrganizationTypeError(): string {
    const control = this.onboardingForm.get('organizationType');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Selecciona el tipo de propiedad';
    return '';
  }

  updateField(fieldName: string, value: string): void {
    this.onboardingForm.get(fieldName)?.setValue(value);
  }

  markFieldTouched(fieldName: string): void {
    this.onboardingForm.get(fieldName)?.markAsTouched();
  }

  onSubmit(): void {
    if (this.onboardingForm.valid) {
      const formValue = this.onboardingForm.value;
      this.submitForm.emit({
        organizationName: formValue.organizationName,
        address: formValue.address,
        email: formValue.email || '',
        nit: formValue.nit,
        phone: formValue.phone,
        organizationType: formValue.organizationType as OrganizationType
      });
    } else {
      this.onboardingForm.markAllAsTouched();
    }
  }
}
