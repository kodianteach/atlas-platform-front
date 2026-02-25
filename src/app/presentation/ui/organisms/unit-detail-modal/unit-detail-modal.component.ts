import { Component, ChangeDetectionStrategy, input, output, signal, inject, OnChanges, SimpleChanges } from '@angular/core';
import { UnitDetail, Unit } from '@domain/models/unit/unit.model';
import { GetUnitMembersUseCase } from '@domain/use-cases/unit/get-unit-members.use-case';

@Component({
  selector: 'app-unit-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './unit-detail-modal.component.html',
  styleUrl: './unit-detail-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitDetailModalComponent implements OnChanges {
  private readonly getUnitMembersUseCase = inject(GetUnitMembersUseCase);

  readonly visible = input(false);
  readonly unit = input<Unit | null>(null);
  readonly closeModal = output<void>();

  readonly loading = signal(false);
  readonly unitDetail = signal<UnitDetail | null>(null);
  readonly error = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] || changes['unit']) {
      const currentUnit = this.unit();
      if (this.visible() && currentUnit) {
        this.loadUnitMembers(currentUnit.id);
      } else {
        this.unitDetail.set(null);
        this.error.set('');
      }
    }
  }

  private loadUnitMembers(unitId: number): void {
    this.loading.set(true);
    this.error.set('');

    this.getUnitMembersUseCase.execute(unitId).subscribe({
      next: (result) => {
        this.loading.set(false);
        if (result.success) {
          this.unitDetail.set(result.data);
        } else {
          this.error.set(result.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al cargar los detalles de la unidad');
      }
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'AVAILABLE': 'Disponible',
      'OCCUPIED': 'Ocupada',
      'MAINTENANCE': 'Mantenimiento',
      'ACTIVE': 'Activo',
      'PENDING': 'Pendiente',
      'INACTIVE': 'Inactivo'
    };
    return statusMap[status?.toUpperCase()] ?? status;
  }

  translateType(type: string): string {
    const typeMap: Record<string, string> = {
      'APARTMENT': 'Apartamento',
      'HOUSE': 'Casa'
    };
    return typeMap[type?.toUpperCase()] ?? type;
  }

  translateOwnership(type: string): string {
    const ownershipMap: Record<string, string> = {
      'OWNER': 'Propietario',
      'TENANT': 'Arrendatario',
      'FAMILY': 'Familiar',
      'GUEST': 'Invitado'
    };
    return ownershipMap[type?.toUpperCase()] ?? type;
  }
}
