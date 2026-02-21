import { Component, ChangeDetectionStrategy, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { ButtonComponent } from '../../atoms/button/button.component';

export interface LoginFormData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, ButtonComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit {
  readonly isSubmitting = input<boolean>(false);
  readonly generalError = input<string | undefined>(undefined);
  readonly submitForm = output<LoginFormData>();

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  getEmailError(): string {
    const emailControl = this.loginForm.get('email');
    if (!emailControl?.touched) return '';
    if (emailControl.hasError('required')) return 'Email is required';
    if (emailControl.hasError('email')) return 'Please enter a valid email address';
    return '';
  }

  getPasswordError(): string {
    const passwordControl = this.loginForm.get('password');
    if (!passwordControl?.touched) return '';
    if (passwordControl.hasError('required')) return 'Password is required';
    return '';
  }

  updateEmail(value: string): void {
    this.loginForm.get('email')?.setValue(value);
  }

  updatePassword(value: string): void {
    this.loginForm.get('password')?.setValue(value);
  }

  markEmailTouched(): void {
    this.loginForm.get('email')?.markAsTouched();
  }

  markPasswordTouched(): void {
    this.loginForm.get('password')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData: LoginFormData = {
        email: this.loginForm.get('email')?.value || '',
        password: this.loginForm.get('password')?.value || ''
      };
      this.submitForm.emit(formData);
    }
  }
}
