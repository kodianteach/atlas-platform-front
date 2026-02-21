import { Component, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { GetOrganizationConfigUseCase } from '@domain/use-cases/organization/get-organization-config.use-case';
import { SaveOrganizationConfigUseCase } from '@domain/use-cases/organization/save-organization-config.use-case';
import { OrganizationConfig } from '@domain/models/organization/organization-config.model';
import { AdminBottomNavComponent } from '../../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';
import { ToggleSwitchComponent } from '../../../ui/atoms/toggle-switch/toggle-switch.component';

@Component({
  selector: 'app-organization-config-page',
  standalone: true,
  imports: [ReactiveFormsModule, AdminBottomNavComponent, ToggleSwitchComponent],
  templateUrl: './organization-config-page.component.html',
  styleUrl: './organization-config-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationConfigPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly getConfigUseCase = inject(GetOrganizationConfigUseCase);
  private readonly saveConfigUseCase = inject(SaveOrganizationConfigUseCase);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly generalError = signal('');
  readonly successMessage = signal('');
  readonly hasChanges = signal(false);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      maxUnitsPerDistribution: new FormControl(100, [
        Validators.required,
        Validators.min(1),
        Validators.max(1000)
      ]),
      enableOwnerPermissionManagement: new FormControl(false)
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.hasChanges.set(true);
      this.successMessage.set('');
    });

    this.loadConfig();
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.generalError.set('');
    this.successMessage.set('');

    const config: OrganizationConfig = {
      maxUnitsPerDistribution: this.form.get('maxUnitsPerDistribution')?.value,
      enableOwnerPermissionManagement: this.form.get('enableOwnerPermissionManagement')?.value ?? false
    };

    this.saveConfigUseCase.execute(config).subscribe({
      next: (result) => {
        this.isSaving.set(false);
        if (result.success) {
          this.hasChanges.set(false);
          this.successMessage.set('Configuración guardada exitosamente');
        } else {
          this.generalError.set(result.error.message);
        }
      },
      error: () => {
        this.isSaving.set(false);
        this.generalError.set('Error al guardar. Inténtalo de nuevo.');
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Campo obligatorio';
    if (control.errors['min']) return 'El valor mínimo es 1';
    if (control.errors['max']) return 'El valor máximo es 1000';
    return 'Campo inválido';
  }

  private loadConfig(): void {
    this.isLoading.set(true);
    this.getConfigUseCase.execute().subscribe({
      next: (result) => {
        this.isLoading.set(false);
        if (result.success) {
          this.form.patchValue({
            maxUnitsPerDistribution: result.data.maxUnitsPerDistribution,
            enableOwnerPermissionManagement: result.data.enableOwnerPermissionManagement ?? false
          });
          this.hasChanges.set(false);
        } else {
          this.generalError.set(result.error.message);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.generalError.set('Error al cargar la configuración.');
      }
    });
  }
}
