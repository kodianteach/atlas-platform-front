import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

/**
 * Password input component with toggle visibility functionality.
 * Provides a reusable password field with eye icon to show/hide password.
 * 
 * @example
 * <app-password-input
 *   id="password"
 *   label="Contraseña"
 *   placeholder="Ingrese su contraseña"
 *   [required]="true"
 *   [value]="password"
 *   [errorMessage]="passwordError"
 *   (valueChange)="onPasswordChange($event)"
 *   (blurred)="onPasswordBlur()" />
 */
@Component({
  selector: 'app-password-input',
  standalone: true,
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordInputComponent {
  readonly label = input<string>('');
  readonly required = input<boolean>(false);
  readonly errorMessage = input<string>('');
  readonly hint = input<string>('');
  readonly id = input<string>('password');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly value = input<string>('');
  readonly autocomplete = input<string>('current-password');

  readonly valueChange = output<string>();
  readonly blurred = output<void>();
  readonly focused = output<void>();

  /** Controls visibility of password text */
  readonly showPassword = signal(false);

  /**
   * Toggles password visibility between text and password type
   */
  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  onValueChange(value: string): void {
    this.valueChange.emit(value);
  }

  onBlur(): void {
    this.blurred.emit();
  }

  onFocus(): void {
    this.focused.emit();
  }
}
