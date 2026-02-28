import { Component, ChangeDetectionStrategy, input, output, inject, signal, OnInit, OnDestroy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { Authorization, AuthorizationFormValue, ServiceType } from '@domain/models/authorization/authorization.model';
import { AuthUser } from '@domain/models/auth/auth.model';
import { UnitSearchResult } from '@domain/models/invitation/invitation.model';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';
import { SearchUnitsUseCase } from '@domain/use-cases/invitation/search-units.use-case';
import { CreateAuthorizationUseCase } from '@domain/use-cases/authorization/create-authorization.use-case';
import { ServiceTypeSelectorComponent } from '../../molecules/service-type-selector/service-type-selector.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { TextInputComponent } from '../../atoms/text-input/text-input.component';
import { SelectInputComponent } from '../../atoms/select-input/select-input.component';
import { ButtonComponent } from '../../atoms/button/button.component';

/**
 * Authorization Form Component - Form for creating visitor authorizations
 * HU #6 - Refactored to use ServiceType, validFrom/validTo, vehicle details
 */
@Component({
  selector: 'app-authorization-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ServiceTypeSelectorComponent,
    FormFieldComponent,
    TextInputComponent,
    SelectInputComponent,
    ButtonComponent
  ],
  templateUrl: './authorization-form.component.html',
  styleUrl: './authorization-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly storage = inject(StorageGateway);
  private readonly searchUnitsUseCase = inject(SearchUnitsUseCase);
  private readonly createAuthorizationUseCase = inject(CreateAuthorizationUseCase);
  private readonly destroyRef = inject(DestroyRef);

  readonly visible = input<boolean>(false);
  readonly authorizationCreated = output<Authorization>();
  readonly formCancel = output<void>();
  readonly errorOccurred = output<string>();

  form!: FormGroup;
  selectedDocument: File | null = null;
  private destroy$ = new Subject<void>();
  readonly submitting = signal(false);

  /** Unit autocomplete state (solo para ADMIN_ATLAS) */
  readonly unitSuggestions = signal<UnitSearchResult[]>([]);
  readonly selectedUnit = signal<UnitSearchResult | null>(null);
  readonly unitSearchQuery = signal('');

  private cachedIsAdmin: boolean | null = null;

  readonly vehicleTypeOptions = [
    { value: 'CAR', label: 'Automóvil' },
    { value: 'MOTORCYCLE', label: 'Motocicleta' },
    { value: 'OTHER', label: 'Otro' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.setDefaultDates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setDefaultDates(): void {
    const now = new Date();
    const validFrom = this.toLocalDateString(now);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const validTo = this.toLocalDateString(tomorrow);
    this.form.patchValue({ validFrom, validTo });
  }

  /**
   * Convierte una fecha a string en formato YYYY-MM-DD (solo fecha)
   */
  private toLocalDateString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  /**
   * Combina una fecha (YYYY-MM-DD) con la hora actual de Colombia (UTC-5)
   * y retorna un ISO string para enviar al servidor
   */
  private combineDateWithColombiaTime(dateStr: string): string {
    // Obtener hora actual en zona horaria de Colombia (America/Bogota = UTC-5)
    const nowColombia = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
    const hours = nowColombia.getHours();
    const minutes = nowColombia.getMinutes();
    const seconds = nowColombia.getSeconds();
    
    // Combinar la fecha seleccionada con la hora actual de Colombia
    const [year, month, day] = dateStr.split('-').map(Number);
    const combinedDate = new Date(year, month - 1, day, hours, minutes, seconds);
    
    return combinedDate.toISOString();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      personName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      personDocument: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ]],
      serviceType: ['VISIT' as ServiceType, Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      unitId: [null as number | null],
      vehiclePlate: ['', Validators.pattern(/^[a-zA-Z0-9-]+$/)],
      vehicleType: [''],
      vehicleColor: ['']
    });
  }

  /**
   * Determina si el usuario actual tiene rol ADMIN_ATLAS.
   * Solo ADMIN_ATLAS ve el autocomplete de unidad; los demás roles
   * tienen su unitId resuelto automáticamente por el backend.
   */
  isAdmin(): boolean {
    if (this.cachedIsAdmin === null) {
      const user = this.storage.getItem<AuthUser>('auth_user');
      const roles = user?.roles ?? [];
      const role = user?.role ?? '';
      this.cachedIsAdmin = roles.includes('ADMIN_ATLAS') || role === 'ADMIN_ATLAS';
    }
    return this.cachedIsAdmin;
  }

  onUnitSearch(query: string): void {
    this.unitSearchQuery.set(query);
    this.selectedUnit.set(null);
    this.form.get('unitId')?.setValue(null);

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
    this.unitSearchQuery.set(unit.code);
    this.form.get('unitId')?.setValue(unit.id);
    this.unitSuggestions.set([]);
  }

  onServiceTypeChange(type: ServiceType): void {
    this.form.get('serviceType')?.setValue(type);
  }

  onDocumentFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedDocument = input.files[0];
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      console.warn('[AuthorizationForm] Formulario inválido:', this.getInvalidControls());
      return;
    }

    this.submitting.set(true);
    const raw = this.form.value;
    const formValue: AuthorizationFormValue = {
      personName: raw.personName.trim(),
      personDocument: raw.personDocument.trim(),
      serviceType: raw.serviceType,
      validFrom: this.combineDateWithColombiaTime(raw.validFrom),
      validTo: this.combineDateWithColombiaTime(raw.validTo),
      unitId: raw.unitId,
      vehiclePlate: raw.vehiclePlate?.trim() || undefined,
      vehicleType: raw.vehicleType || undefined,
      vehicleColor: raw.vehicleColor?.trim() || undefined
    };

    console.log('[AuthorizationForm] Llamando al backend con:', formValue);
    this.createAuthorizationUseCase.execute(formValue, this.selectedDocument ?? undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          console.log('[AuthorizationForm] Resultado del backend:', result);
          this.submitting.set(false);
          if (result.success) {
            this.authorizationCreated.emit(result.data);
            this.resetForm();
          } else {
            this.errorOccurred.emit(result.error.message);
          }
        },
        error: (err) => {
          console.error('[AuthorizationForm] Error inesperado:', err);
          this.submitting.set(false);
          this.errorOccurred.emit('No se pudo crear la autorización. Verifica tu conexión e intenta nuevamente');
        }
      });
  }

  private getInvalidControls(): Record<string, unknown> {
    const invalid: Record<string, unknown> = {};
    for (const key of Object.keys(this.form.controls)) {
      const control = this.form.get(key);
      if (control?.invalid) {
        invalid[key] = { value: control.value, errors: control.errors };
      }
    }
    return invalid;
  }

  onCancel(): void {
    this.resetForm();
    this.formCancel.emit();
  }

  getSelectedDocument(): File | null {
    return this.selectedDocument;
  }

  private resetForm(): void {
    this.selectedDocument = null;
    this.form.reset({
      personName: '',
      personDocument: '',
      serviceType: 'VISIT',
      validFrom: '',
      validTo: '',
      unitId: null,
      vehiclePlate: '',
      vehicleType: '',
      vehicleColor: ''
    });
    this.setDefaultDates();
    this.unitSuggestions.set([]);
    this.selectedUnit.set(null);
    this.unitSearchQuery.set('');
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control && control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return 'Campo obligatorio';
      }
      if (control.errors?.['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['pattern']) {
        if (fieldName === 'personName') return 'Solo letras y espacios';
        if (fieldName === 'personDocument') return 'Solo alfanuméricos';
        if (fieldName === 'vehiclePlate') return 'Solo alfanuméricos y guiones';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
