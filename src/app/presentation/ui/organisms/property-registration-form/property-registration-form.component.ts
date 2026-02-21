import { Component, input, output, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TextInputComponent } from '../../atoms/text-input/text-input.component';
import { SelectInputComponent } from '../../atoms/select-input/select-input.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { PropertyRegistrationData, PropertyType } from '@domain/models/property/property.model';

@Component({
  selector: 'app-property-registration-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    SelectInputComponent,
    ButtonComponent
  ],
  templateUrl: './property-registration-form.component.html',
  styleUrl: './property-registration-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyRegistrationFormComponent implements OnInit, OnDestroy {
  readonly initialData = input<PropertyRegistrationData | undefined>(undefined);
  readonly isSubmitting = input(false);
  readonly formSubmit = output<PropertyRegistrationData>();
  readonly formBack = output<void>();
  
  form!: FormGroup;
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  readonly propertyTypeOptions = [
    { value: 'conjunto', label: 'Conjunto' },
    { value: 'ciudadela', label: 'Ciudadela' },
    { value: 'condominio', label: 'Condominio' }
  ];

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
      condominiumName: [
        data?.condominiumName || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      totalUnits: [
        data?.totalUnits || '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^\d+$/)
        ]
      ],
      propertyType: [
        data?.propertyType || '',
        [Validators.required]
      ]
    });

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Form validity is automatically updated by Angular
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData: PropertyRegistrationData = {
        condominiumName: this.form.value.condominiumName,
        taxId: '',
        totalUnits: parseInt(this.form.value.totalUnits, 10),
        propertyType: this.form.value.propertyType as PropertyType
      };
      this.formSubmit.emit(formData);
    }
  }

  onBack(): void {
    this.formBack.emit();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    switch (fieldName) {
      case 'condominiumName':
        if (control.errors['required']) return 'El nombre del condominio es requerido';
        if (control.errors['minlength']) return 'El nombre debe tener al menos 2 caracteres';
        if (control.errors['maxlength']) return 'El nombre no puede exceder 100 caracteres';
        break;
      case 'totalUnits':
        if (control.errors['required']) return 'El total de unidades es requerido';
        if (control.errors['min']) return 'El total de unidades debe ser al menos 1';
        if (control.errors['pattern']) return 'El total de unidades debe ser un número válido';
        break;
      case 'propertyType':
        if (control.errors['required']) return 'El tipo de propiedad es requerido';
        break;
    }
    return '';
  }

  hasError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
