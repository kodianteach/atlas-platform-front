import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { DistributeUnitsUseCase } from '@domain/use-cases/unit/distribute-units.use-case';
import { GetOrganizationConfigUseCase } from '@domain/use-cases/organization/get-organization-config.use-case';
import { GetOrganizationUnitsUseCase } from '@domain/use-cases/unit/get-organization-units.use-case';
import { UnitDistributeRequest, UnitDistributeResponse, Unit } from '@domain/models/unit/unit.model';
import { AuthenticationService } from '../../../../services/authentication.service';
import { AdminBottomNavComponent } from '../../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';
import { BulkUnitFormComponent } from '../../../ui/organisms/bulk-unit-form/bulk-unit-form.component';
import { DistributionResultComponent } from '../../../ui/organisms/distribution-result/distribution-result.component';
import { UnitDetailModalComponent } from '../../../ui/organisms/unit-detail-modal/unit-detail-modal.component';

@Component({
  selector: 'app-bulk-unit-creation-page',
  standalone: true,
  imports: [AdminBottomNavComponent, BulkUnitFormComponent, DistributionResultComponent, UnitDetailModalComponent],
  templateUrl: './bulk-unit-creation-page.component.html',
  styleUrl: './bulk-unit-creation-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkUnitCreationPageComponent implements OnInit {
  private readonly distributeUnitsUseCase = inject(DistributeUnitsUseCase);
  private readonly getOrgConfigUseCase = inject(GetOrganizationConfigUseCase);
  private readonly getOrgUnitsUseCase = inject(GetOrganizationUnitsUseCase);
  private readonly authService = inject(AuthenticationService);

  readonly isSubmitting = signal(false);
  readonly isLoadingConfig = signal(true);
  readonly maxUnitsAllowed = signal(100);
  readonly generalError = signal('');
  readonly distributionResult = signal<UnitDistributeResponse | null>(null);
  readonly showForm = signal(false);
  
  // Units Preview Logic
  readonly isLoadingUnits = signal(false);
  readonly units = signal<Unit[]>([]);

  // Unit Detail Modal
  readonly showUnitModal = signal(false);
  readonly selectedUnit = signal<Unit | null>(null);
  
  readonly groupedUnits = computed(() => {
    const unitList = this.units();
    const groups: { [key: string]: Unit[] } = {};
    
    unitList.forEach(unit => {
      if (!groups[unit.type]) {
        groups[unit.type] = [];
      }
      groups[unit.type].push(unit);
    });

    return Object.keys(groups).sort((a, b) => a.localeCompare(b)).map(type => {
      const sorted = [...groups[type]];
      sorted.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
      return { type, units: sorted };
    });
  });

  ngOnInit(): void {
    this.loadOrganizationConfig();
    this.loadUnits();
  }
  
  private loadUnits(): void {
    const user = this.authService.getUser();
    if (!user?.organizationId) return;

    this.isLoadingUnits.set(true);
    this.getOrgUnitsUseCase.execute(Number(user.organizationId)).subscribe({
      next: (result) => {
        this.isLoadingUnits.set(false);
        if (result.success) {
          this.units.set(result.data);
        }
      },
      error: () => {
        this.isLoadingUnits.set(false);
      }
    });
  }

  // Remove sortUnits method as it is now inside computed


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
    this.showForm.set(false);
  }

  toggleForm(): void {
    this.showForm.update(v => !v);
  }

  handleCreateMore(): void {
    this.distributionResult.set(null);
    this.showForm.set(true);
    this.generalError.set('');
  }

  openUnitDetail(unit: Unit): void {
    this.selectedUnit.set(unit);
    this.showUnitModal.set(true);
  }

  closeUnitModal(): void {
    this.showUnitModal.set(false);
    this.selectedUnit.set(null);
  }

  isOccupied(unit: Unit): boolean {
    return unit.status === 'OCCUPIED';
  }

  translateType(type: string): string {
    const typeMap: Record<string, string> = {
      'APARTMENT': 'Apartamentos',
      'HOUSE': 'Casas'
    };
    return typeMap[type?.toUpperCase()] ?? type;
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
