/**
 * Admin Register Form Component (Organism)
 * Reactive form for admin pre-registration (dev/backoffice tool)
 * Fields: fullName, email, documentType, documentNumber, phone
 */
import { Component, ChangeDetectionStrategy, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { SelectInputComponent, SelectOption } from '../../atoms/select-input/select-input.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { DocumentType } from '@domain/models/pre-registration/pre-registration.model';

export interface AdminRegisterFormData {
  fullName: string;
  email: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
}

@Component({
  selector: 'app-admin-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, SelectInputComponent, ButtonComponent],
  templateUrl: './admin-register-form.component.html',
  styleUrl: './admin-register-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRegisterFormComponent implements OnInit {
  readonly isSubmitting = input<boolean>(false);
  readonly generalError = input<string | undefined>(undefined);
  readonly submitForm = output<AdminRegisterFormData>();

  registerForm!: FormGroup;

  readonly documentTypeOptions: SelectOption[] = [
    { value: DocumentType.CC, label: 'Cédula de Ciudadanía' },
    { value: DocumentType.CE, label: 'Cédula de Extranjería' },
    { value: DocumentType.NIT, label: 'NIT' },
    { value: DocumentType.PA, label: 'Pasaporte' },
    { value: DocumentType.TI, label: 'Tarjeta de Identidad' },
    { value: DocumentType.PEP, label: 'PEP' }
  ];

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      documentType: new FormControl('', [Validators.required]),
      documentNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{5,15}$/)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{7,10}$/)])
    });
  }

  getFullNameError(): string {
    const control = this.registerForm.get('fullName');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'El nombre completo es obligatorio';
    if (control.hasError('minlength')) return 'Mínimo 3 caracteres';
    if (control.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }

  getEmailError(): string {
    const control = this.registerForm.get('email');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'El correo electrónico es obligatorio';
    if (control.hasError('email')) return 'Ingresa un correo electrónico válido';
    return '';
  }

  getDocumentTypeError(): string {
    const control = this.registerForm.get('documentType');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Selecciona el tipo de documento';
    return '';
  }

  getDocumentNumberError(): string {
    const control = this.registerForm.get('documentNumber');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'El número de documento es obligatorio';
    if (control.hasError('pattern')) return 'Número de documento inválido (5-15 dígitos)';
    return '';
  }

  getPhoneError(): string {
    const control = this.registerForm.get('phone');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'El teléfono es obligatorio';
    if (control.hasError('pattern')) return 'Número de teléfono inválido (7-10 dígitos)';
    return '';
  }

  updateField(fieldName: string, value: string): void {
    this.registerForm.get(fieldName)?.setValue(value);
  }

  markFieldTouched(fieldName: string): void {
    this.registerForm.get(fieldName)?.markAsTouched();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      this.submitForm.emit({
        fullName: formValue.fullName,
        email: formValue.email,
        documentType: formValue.documentType as DocumentType,
        documentNumber: formValue.documentNumber,
        phone: formValue.phone
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
