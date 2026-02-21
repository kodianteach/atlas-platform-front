/**
 * Activation Form Component (Organism)
 * Reactive form for admin account activation with password change
 * Reutilizes FormFieldComponent, ButtonComponent and CustomValidators
 */
import { Component, ChangeDetectionStrategy, input, output, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { CustomValidators } from '@infrastructure/validators/custom.validators';

export interface ActivationFormData {
  email: string;
  currentPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-activation-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, ButtonComponent],
  templateUrl: './activation-form.component.html',
  styleUrl: './activation-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivationFormComponent implements OnInit {
  readonly isSubmitting = input<boolean>(false);
  readonly generalError = input<string | undefined>(undefined);
  readonly submitForm = output<ActivationFormData>();

  activationForm!: FormGroup;

  ngOnInit(): void {
    this.activationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, CustomValidators.strongPassword()]),
      confirmNewPassword: new FormControl('', [Validators.required])
    }, {
      validators: CustomValidators.mustMatch('newPassword', 'confirmNewPassword')
    });
  }

  getEmailError(): string {
    const control = this.activationForm.get('email');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'El correo electrónico es obligatorio';
    if (control.hasError('email')) return 'Ingresa un correo electrónico válido';
    return '';
  }

  getCurrentPasswordError(): string {
    const control = this.activationForm.get('currentPassword');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'La contraseña temporal es obligatoria';
    return '';
  }

  getNewPasswordError(): string {
    const control = this.activationForm.get('newPassword');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'La nueva contraseña es obligatoria';
    if (control.hasError('strongPassword')) return 'Debe contener mayúscula, minúscula y número (mínimo 8 caracteres)';
    return '';
  }

  getConfirmPasswordError(): string {
    const control = this.activationForm.get('confirmNewPassword');
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Confirma tu nueva contraseña';
    if (control.hasError('mustMatch')) return 'Las contraseñas no coinciden';
    return '';
  }

  updateField(fieldName: string, value: string): void {
    this.activationForm.get(fieldName)?.setValue(value);
  }

  markFieldTouched(fieldName: string): void {
    this.activationForm.get(fieldName)?.markAsTouched();
  }

  onSubmit(): void {
    if (this.activationForm.valid) {
      const formData: ActivationFormData = {
        email: this.activationForm.get('email')?.value || '',
        currentPassword: this.activationForm.get('currentPassword')?.value || '',
        newPassword: this.activationForm.get('newPassword')?.value || ''
      };
      this.submitForm.emit(formData);
    }
  }
}
