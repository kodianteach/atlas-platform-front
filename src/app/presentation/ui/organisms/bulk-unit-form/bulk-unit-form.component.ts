import { Component, ChangeDetectionStrategy, input, output, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UnitType } from '@domain/models/unit/unit.model';

@Component({
  selector: 'app-bulk-unit-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './bulk-unit-form.component.html',
  styleUrl: './bulk-unit-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkUnitFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = input(false);
  readonly maxAllowed = input(100);

  readonly formSubmit = output<{
    codePrefix: string;
    rangeStart: number;
    rangeEnd: number;
    unitType: string;
    vehiclesEnabled: boolean;
    vehicleLimit: number;
  }>();
  readonly formCancel = output<void>();

  readonly unitTypes = Object.values(UnitType);
  readonly vehiclesEnabled = signal(false);
  readonly previewCodes = signal<string[]>([]);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      codePrefix: new FormControl('', [
        Validators.maxLength(10),
        Validators.pattern(/^[A-Za-z0-9\-]+$/)
      ]),
      rangeStart: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(9999)
      ]),
      rangeEnd: new FormControl(10, [
        Validators.required,
        Validators.min(1),
        Validators.max(9999)
      ]),
      unitType: new FormControl(UnitType.APARTMENT, [Validators.required]),
      vehiclesEnabled: new FormControl(false),
      vehicleLimit: new FormControl(2, [
        Validators.min(0),
        Validators.max(10)
      ])
    });

    this.form.get('vehiclesEnabled')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((enabled: boolean) => {
      this.vehiclesEnabled.set(enabled);
    });

    this.form.get('codePrefix')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updatePreview());
    this.form.get('rangeStart')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updatePreview());
    this.form.get('rangeEnd')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updatePreview());
  }

  get unitCount(): number {
    const start = this.form.get('rangeStart')?.value || 0;
    const end = this.form.get('rangeEnd')?.value || 0;
    if (end < start) return 0;
    return end - start + 1;
  }

  get exceedsLimit(): boolean {
    return this.unitCount > this.maxAllowed();
  }

  get rangeError(): string {
    const start = this.form.get('rangeStart')?.value;
    const end = this.form.get('rangeEnd')?.value;
    if (start && end && end < start) {
      return 'El rango final debe ser mayor o igual al inicial';
    }
    if (this.exceedsLimit) {
      return `Se generarán ${this.unitCount} unidades, pero el máximo permitido es ${this.maxAllowed()}`;
    }
    return '';
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors || !control.touched) return '';

    const errors: Record<string, Record<string, string>> = {
      codePrefix: {
        maxlength: 'Máximo 10 caracteres',
        pattern: 'Solo letras, números y guiones'
      },
      rangeStart: {
        required: 'Campo obligatorio',
        min: 'Mínimo 1',
        max: 'Máximo 9999'
      },
      rangeEnd: {
        required: 'Campo obligatorio',
        min: 'Mínimo 1',
        max: 'Máximo 9999'
      },
      vehicleLimit: {
        min: 'Mínimo 0',
        max: 'Máximo 10'
      }
    };

    const fieldErrors = errors[field] || {};
    const firstError = Object.keys(control.errors)[0];
    return fieldErrors[firstError] || 'Campo inválido';
  }

  onSubmit(): void {
    if (this.form.invalid || this.exceedsLimit) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.formSubmit.emit({
      codePrefix: value.codePrefix.toUpperCase(),
      rangeStart: value.rangeStart,
      rangeEnd: value.rangeEnd,
      unitType: value.unitType,
      vehiclesEnabled: value.vehiclesEnabled,
      vehicleLimit: value.vehiclesEnabled ? value.vehicleLimit : 0
    });
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  private updatePreview(): void {
    const prefix = (this.form.get('codePrefix')?.value || '').toUpperCase();
    const start = this.form.get('rangeStart')?.value || 0;
    const end = this.form.get('rangeEnd')?.value || 0;
    
    if (end < start) {
      this.previewCodes.set([]);
      return;
    }
    
    const codes: string[] = [];
    const max = Math.min(end, start + 4); // Show up to 5 preview codes
    
    for (let i = start; i <= max; i++) {
      codes.push(prefix ? `${prefix}-${i}` : `${i}`);
    }
    
    if (end > max) {
      codes.push('...');
      codes.push(prefix ? `${prefix}-${end}` : `${end}`);
    }
    this.previewCodes.set(codes);
  }
}
