import { Component, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { GetOrganizationConfigUseCase } from '@domain/use-cases/organization/get-organization-config.use-case';
import { SaveOrganizationConfigUseCase } from '@domain/use-cases/organization/save-organization-config.use-case';
import { OrganizationConfig } from '@domain/models/organization/organization-config.model';
import { AdminBottomNavComponent } from '../../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';
import { ToggleSwitchComponent } from '../../../ui/atoms/toggle-switch/toggle-switch.component';
import { ColorExtractionService, ExtractedColors } from '@infrastructure/services/color-extraction.service';

@Component({
  selector: 'app-organization-config-page',
  standalone: true,
  imports: [ReactiveFormsModule, AdminBottomNavComponent, ToggleSwitchComponent],
  templateUrl: './organization-config-page.component.html',
  styleUrl: './organization-config-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganizationConfigPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly getConfigUseCase = inject(GetOrganizationConfigUseCase);
  private readonly saveConfigUseCase = inject(SaveOrganizationConfigUseCase);
  private readonly colorExtractionService = inject(ColorExtractionService);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly generalError = signal('');
  readonly successMessage = signal('');
  readonly hasChanges = signal(false);

  // Branding signals
  readonly logoPreview = signal<string | null>(null);
  readonly isExtractingColors = signal(false);
  readonly logoError = signal('');

  private logoBase64: string | null = null;
  private logoContentType: string | null = null;

  form!: FormGroup;

  private static readonly MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
  private static readonly ALLOWED_TYPES = ['image/png', 'image/jpeg'];
  private static readonly HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

  ngOnInit(): void {
    this.form = new FormGroup({
      maxUnitsPerDistribution: new FormControl(100, [
        Validators.required,
        Validators.min(1),
        Validators.max(1000)
      ]),
      enableOwnerPermissionManagement: new FormControl(false),
      dominantColor: new FormControl('', [Validators.pattern(OrganizationConfigPageComponent.HEX_COLOR_PATTERN)]),
      secondaryColor: new FormControl('', [Validators.pattern(OrganizationConfigPageComponent.HEX_COLOR_PATTERN)]),
      accentColor: new FormControl('', [Validators.pattern(OrganizationConfigPageComponent.HEX_COLOR_PATTERN)])
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.hasChanges.set(true);
      this.successMessage.set('');
    });

    this.loadConfig();
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    this.logoError.set('');

    if (!OrganizationConfigPageComponent.ALLOWED_TYPES.includes(file.type)) {
      this.logoError.set('Formato no válido. Solo se aceptan imágenes PNG y JPG.');
      input.value = '';
      return;
    }

    if (file.size > OrganizationConfigPageComponent.MAX_LOGO_SIZE) {
      this.logoError.set('La imagen excede el tamaño máximo permitido (2MB).');
      input.value = '';
      return;
    }

    // Read file for preview and Base64
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.logoPreview.set(dataUrl);
      this.logoBase64 = dataUrl.split(',')[1];
      this.logoContentType = file.type;
      this.hasChanges.set(true);

      // Extract colors automatically
      this.isExtractingColors.set(true);
      this.colorExtractionService.extractColors(file).then(
        (colors: ExtractedColors) => {
          this.form.patchValue({
            dominantColor: colors.dominant,
            secondaryColor: colors.secondary,
            accentColor: colors.accent
          });
          this.isExtractingColors.set(false);
        },
        () => {
          this.isExtractingColors.set(false);
        }
      );
    };
    reader.readAsDataURL(file);
  }

  onColorPickerChange(field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.get(field)?.setValue(input.value.toUpperCase());
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
      enableOwnerPermissionManagement: this.form.get('enableOwnerPermissionManagement')?.value ?? false,
      logoBase64: this.logoBase64 ?? undefined,
      logoContentType: this.logoContentType ?? undefined,
      dominantColor: this.form.get('dominantColor')?.value || undefined,
      secondaryColor: this.form.get('secondaryColor')?.value || undefined,
      accentColor: this.form.get('accentColor')?.value || undefined
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
    if (control.errors['pattern']) return 'Formato hex inválido (ej: #FF8C61)';
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
            enableOwnerPermissionManagement: result.data.enableOwnerPermissionManagement ?? false,
            dominantColor: result.data.dominantColor ?? '',
            secondaryColor: result.data.secondaryColor ?? '',
            accentColor: result.data.accentColor ?? ''
          });

          // Load logo preview if exists
          if (result.data.logoBase64 && result.data.logoContentType) {
            this.logoPreview.set(`data:${result.data.logoContentType};base64,${result.data.logoBase64}`);
            this.logoBase64 = result.data.logoBase64;
            this.logoContentType = result.data.logoContentType;
          }

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

  goBack(): void {
    this.router.navigate(['/admin/more']);
  }
}
