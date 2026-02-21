import { Component, ChangeDetectionStrategy, input, output, inject, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TextInputComponent } from '../../atoms/text-input/text-input.component';
import { ButtonComponent } from '../../atoms/button/button.component';

export interface ProfileSetupData {
  fullName: string;
  phoneNumber: string;
  adminId: string;
}

@Component({
  selector: 'app-profile-setup-form',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, ButtonComponent],
  templateUrl: './profile-setup-form.component.html',
  styleUrl: './profile-setup-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSetupFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);

  readonly initialData = input<ProfileSetupData | undefined>(undefined);
  readonly isSubmitting = input<boolean>(false);
  readonly formSubmit = output<ProfileSetupData>();
  readonly formCancel = output<void>();

  form!: FormGroup;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    const data = this.initialData();
    this.form = this.fb.group({
      fullName: [
        data?.fullName || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        ]
      ],
      phoneNumber: [
        data?.phoneNumber || '',
        [
          Validators.required,
          Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)
        ]
      ],
      adminId: [
        data?.adminId || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ]
    });

    // Subscribe to form changes for reactive validation
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Form validity is automatically updated by Angular
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData: ProfileSetupData = {
        fullName: this.form.value.fullName,
        phoneNumber: this.form.value.phoneNumber,
        adminId: this.form.value.adminId
      };
      this.formSubmit.emit(formData);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    switch (fieldName) {
      case 'fullName':
        if (control.errors['required']) return 'El nombre completo es requerido';
        if (control.errors['minlength']) return 'El nombre debe tener al menos 2 caracteres';
        if (control.errors['pattern']) return 'El nombre solo puede contener letras y espacios';
        break;
      case 'phoneNumber':
        if (control.errors['required']) return 'El número de teléfono es requerido';
        if (control.errors['pattern']) return 'Por favor ingresa un número de teléfono válido';
        break;
      case 'adminId':
        if (control.errors['required']) return 'El ID de administrador es requerido';
        if (control.errors['minlength']) return 'El ID debe tener al menos 3 caracteres';
        break;
    }
    return '';
  }

  hasError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
