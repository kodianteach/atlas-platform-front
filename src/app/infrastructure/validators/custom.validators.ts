/**
 * Custom Validators - Reusable form validation functions
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  /**
   * Validates that the field contains only letters and spaces
   */
  static onlyLetters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(control.value);
      return valid ? null : { onlyLetters: true };
    };
  }

  /**
   * Validates that the field contains only numbers
   */
  static onlyNumbers(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^[0-9]+$/.test(control.value);
      return valid ? null : { onlyNumbers: true };
    };
  }

  /**
   * Validates phone number format (10-15 digits)
   */
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^[0-9]{10,15}$/.test(control.value);
      return valid ? null : { phoneNumber: true };
    };
  }

  /**
   * Validates that the date is not in the future
   */
  static notFutureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const inputDate = new Date(control.value);
      const today = new Date();
      return inputDate <= today ? null : { futureDate: true };
    };
  }

  /**
   * Validates that two fields match (e.g., password confirmation)
   * @param controlName - First field name
   * @param matchingControlName - Field that must match
   */
  static mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) return null;

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Validates alphanumeric format (letters and numbers only)
   */
  static alphanumeric(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^[a-zA-Z0-9]+$/.test(control.value);
      return valid ? null : { alphanumeric: true };
    };
  }

  /**
   * Validates strong password (min 8 chars, uppercase, lowercase, number)
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(control.value);
      return valid ? null : { strongPassword: true };
    };
  }

  /**
   * Validates license plate format (Colombian standard)
   */
  static licensePlate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^[A-Z]{3}[0-9]{3}$/.test(control.value.toUpperCase());
      return valid ? null : { licensePlate: true };
    };
  }
}
