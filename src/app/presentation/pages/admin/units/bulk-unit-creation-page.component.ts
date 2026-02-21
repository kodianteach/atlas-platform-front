import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DistributeUnitsUseCase } from '@domain/use-cases/unit/distribute-units.use-case';
import { GetOrganizationConfigUseCase } from '@domain/use-cases/organization/get-organization-config.use-case';
import { UnitDistributeRequest, UnitDistributeResponse } from '@domain/models/unit/unit.model';
import { AuthenticationService } from '../../../../services/authentication.service';
import { AdminBottomNavComponent } from '../../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';
import { BulkUnitFormComponent } from '../../../ui/organisms/bulk-unit-form/bulk-unit-form.component';
import { DistributionResultComponent } from '../../../ui/organisms/distribution-result/distribution-result.component';

@Component({
  selector: 'app-bulk-unit-creation-page',
  standalone: true,
  imports: [AdminBottomNavComponent, BulkUnitFormComponent, DistributionResultComponent],
  templateUrl: './bulk-unit-creation-page.component.html',
  styleUrl: './bulk-unit-creation-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkUnitCreationPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly distributeUnitsUseCase = inject(DistributeUnitsUseCase);
  private readonly getOrgConfigUseCase = inject(GetOrganizationConfigUseCase);
  private readonly authService = inject(AuthenticationService);

  readonly isSubmitting = signal(false);
  readonly isLoadingConfig = signal(true);
  readonly maxUnitsAllowed = signal(100);
  readonly generalError = signal('');
  readonly distributionResult = signal<UnitDistributeResponse | null>(null);

  ngOnInit(): void {
    this.loadOrganizationConfig();
  }

  handleSubmit(formData: {
    codePrefix: string;
    rangeStart: number;
    rangeEnd: number;
    unitType: string;
    vehiclesEnabled: boolean;
    vehicleLimit: number;
  }): void {
    this.isSubmitting.set(true);
    this.generalError.set('');

    const user = this.authService.getUser();
    if (!user?.organizationId) {
      this.isSubmitting.set(false);
      this.generalError.set('No se pudo determinar la organización. Inicia sesión nuevamente.');
      return;
    }

    const request: UnitDistributeRequest = {
      organizationId: Number(user.organizationId),
      codePrefix: formData.codePrefix,
      rangeStart: formData.rangeStart,
      rangeEnd: formData.rangeEnd,
      unitType: formData.unitType,
      vehiclesEnabled: formData.vehiclesEnabled,
      vehicleLimit: formData.vehicleLimit
    };

    this.distributeUnitsUseCase.execute(request).subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        if (result.success) {
          this.distributionResult.set(result.data);
        } else {
          this.generalError.set(result.error.message);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.generalError.set('Error inesperado. Inténtalo de nuevo.');
      }
    });
  }

  handleCancel(): void {
    this.router.navigate(['/home']);
  }

  handleCreateMore(): void {
    this.distributionResult.set(null);
    this.generalError.set('');
  }

  private loadOrganizationConfig(): void {
    this.isLoadingConfig.set(true);
    this.getOrgConfigUseCase.execute().subscribe({
      next: (result) => {
        this.isLoadingConfig.set(false);
        if (result.success) {
          this.maxUnitsAllowed.set(result.data.maxUnitsPerDistribution);
        }
      },
      error: () => {
        this.isLoadingConfig.set(false);
      }
    });
  }
}
