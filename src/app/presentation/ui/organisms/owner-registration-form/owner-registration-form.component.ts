/**
 * Owner Registration Form Component (Organism)
 * Reactive form for owner self-registration via invitation token.
 * Includes unit autocomplete and user lookup for autocompletion.
 */
import { Component, ChangeDetectionStrategy, input, output, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { SelectInputComponent } from '../../atoms/select-input/select-input.component';
import { CustomValidators } from '@infrastructure/validators/custom.validators';
import { LookupUserUseCase } from '@domain/use-cases/invitation/lookup-user.use-case';
import { SearchUnitsUseCase } from '@domain/use-cases/invitation/search-units.use-case';
import { UnitSearchResult } from '@domain/models/invitation/invitation.model';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

export interface OwnerRegistrationFormData {
  names: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  password: string;
  confirmPassword: string;
  unitId?: number;
}

@Component({
  selector: 'app-owner-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, ButtonComponent, SelectInputComponent],
  templateUrl: './owner-registration-form.component.html',
  styleUrl: './owner-registration-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnerRegistrationFormComponent implements OnInit {
  readonly isSubmitting = input<boolean>(false);
  readonly generalError = input<string | undefined>(undefined);
  readonly submitForm = output<OwnerRegistrationFormData>();

  private readonly lookupUserUseCase = inject(LookupUserUseCase);
  private readonly searchUnitsUseCase = inject(SearchUnitsUseCase);
  private readonly destroyRef = inject(DestroyRef);

  registrationForm!: FormGroup;
  readonly unitSuggestions = signal<UnitSearchResult[]>([]);
  readonly selectedUnit = signal<UnitSearchResult | null>(null);
  readonly unitSearchQuery = signal('');

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
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      documentType: new FormControl('CC', [Validators.required]),
      documentNumber: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, CustomValidators.strongPassword()]),
      confirmPassword: new FormControl('', [Validators.required]),
      unitSearch: new FormControl('')
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
      case 'email':
        if (control.hasError('required')) return 'El correo electrónico es obligatorio';
        if (control.hasError('email')) return 'Ingresa un correo electrónico válido';
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
            if (user.email) this.registrationForm.get('email')?.setValue(user.email);
            if (user.phone) this.registrationForm.get('phone')?.setValue(user.phone);
          }
        });
    }
  }

  onUnitSearch(query: string): void {
    this.unitSearchQuery.set(query);
    this.selectedUnit.set(null);
    if (query.length < 1) {
      this.unitSuggestions.set([]);
      return;
    }
    this.searchUnitsUseCase.execute(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.unitSuggestions.set(result.data);
        }
      });
  }

  selectUnit(unit: UnitSearchResult): void {
    this.selectedUnit.set(unit);
    this.registrationForm.get('unitSearch')?.setValue(unit.code);
    this.unitSuggestions.set([]);
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData: OwnerRegistrationFormData = {
        names: this.registrationForm.get('names')?.value || '',
        email: this.registrationForm.get('email')?.value || '',
        phone: this.registrationForm.get('phone')?.value || '',
        documentType: this.registrationForm.get('documentType')?.value || 'CC',
        documentNumber: this.registrationForm.get('documentNumber')?.value || '',
        password: this.registrationForm.get('password')?.value || '',
        confirmPassword: this.registrationForm.get('confirmPassword')?.value || '',
        unitId: this.selectedUnit()?.id
      };
      this.submitForm.emit(formData);
    }
  }
}
