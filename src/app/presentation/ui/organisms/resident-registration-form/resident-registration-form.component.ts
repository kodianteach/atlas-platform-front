/**
 * Resident Registration Form Component (Organism)
 * Reactive form for resident registration via invitation token.
 */
import { Component, ChangeDetectionStrategy, input, output, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { CustomValidators } from '@infrastructure/validators/custom.validators';
import { LookupUserUseCase } from '@domain/use-cases/invitation/lookup-user.use-case';

export interface ResidentRegistrationFormData {
  names: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-resident-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, ButtonComponent],
  templateUrl: './resident-registration-form.component.html',
  styleUrl: './resident-registration-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResidentRegistrationFormComponent implements OnInit {
  readonly isSubmitting = input<boolean>(false);
  readonly generalError = input<string | undefined>(undefined);
  readonly submitForm = output<ResidentRegistrationFormData>();

  private readonly lookupUserUseCase = inject(LookupUserUseCase);
  private readonly destroyRef = inject(DestroyRef);

  registrationForm!: FormGroup;

  readonly documentTypeOptions = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'TI', label: 'Tarjeta de Identidad' }
  ];

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      names: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
      documentType: new FormControl('CC', [Validators.required]),
      documentNumber: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, CustomValidators.strongPassword()]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {
      validators: CustomValidators.mustMatch('password', 'confirmPassword')
    });
  }

  getError(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    if (!control?.touched) return '';

    switch (fieldName) {
      case 'names':
        if (control.hasError('required')) return 'Los nombres son obligatorios';
        break;
      case 'documentType':
        if (control.hasError('required')) return 'El tipo de documento es obligatorio';
        break;
      case 'documentNumber':
        if (control.hasError('required')) return 'El número de documento es obligatorio';
        break;
      case 'password':
        if (control.hasError('required')) return 'La contraseña es obligatoria';
        if (control.hasError('strongPassword')) return 'Debe contener mayúscula, minúscula y número (mínimo 8 caracteres)';
        break;
      case 'confirmPassword':
        if (control.hasError('required')) return 'Confirma tu contraseña';
        if (control.hasError('mustMatch')) return 'Las contraseñas no coinciden';
        break;
    }
    return '';
  }

  updateField(fieldName: string, value: string): void {
    this.registrationForm.get(fieldName)?.setValue(value);
  }

  markFieldTouched(fieldName: string): void {
    this.registrationForm.get(fieldName)?.markAsTouched();
  }

  onDocumentChange(): void {
    const docType = this.registrationForm.get('documentType')?.value;
    const docNumber = this.registrationForm.get('documentNumber')?.value;
    if (docType && docNumber && docNumber.length >= 5) {
      this.lookupUserUseCase.executeByDocument(docType, docNumber)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {
          if (result.success && result.data.found) {
            const user = result.data;
            if (user.names) this.registrationForm.get('names')?.setValue(user.names);
            if (user.phone) this.registrationForm.get('phone')?.setValue(user.phone);
          }
        });
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData: ResidentRegistrationFormData = {
        names: this.registrationForm.get('names')?.value || '',
        phone: this.registrationForm.get('phone')?.value || '',
        documentType: this.registrationForm.get('documentType')?.value || 'CC',
        documentNumber: this.registrationForm.get('documentNumber')?.value || '',
        password: this.registrationForm.get('password')?.value || '',
        confirmPassword: this.registrationForm.get('confirmPassword')?.value || ''
      };
      this.submitForm.emit(formData);
    }
  }
}
