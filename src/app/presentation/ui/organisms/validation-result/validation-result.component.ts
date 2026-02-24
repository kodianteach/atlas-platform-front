import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { QrPayload, ValidationResult } from '@domain/models/entry/entry.model';

/**
 * Unified validation result overlay — green for VALID, red for INVALID/EXPIRED/REVOKED.
 * Replaces AccessGrantedModal with full valid/invalid support.
 */
@Component({
  selector: 'app-validation-result',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './validation-result.component.html',
  styleUrl: './validation-result.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationResultComponent {
  readonly visible = input<boolean>(false);
  readonly resultType = input<ValidationResult>('VALID');
  readonly qrPayload = input<QrPayload | null>(null);
  readonly vehicleConfirmationNeeded = input<boolean>(false);

  readonly dismiss = output<void>();
  readonly confirmEntry = output<void>();
  readonly denyEntry = output<void>();
  readonly vehicleConfirmed = output<boolean>();

  readonly isValid = computed(() => this.resultType() === 'VALID');

  readonly icon = computed(() => this.isValid() ? 'bi-check-circle-fill' : 'bi-x-circle-fill');

  readonly title = computed(() => {
    switch (this.resultType()) {
      case 'VALID': return 'Acceso Concedido';
      case 'INVALID': return 'Acceso Denegado';
      case 'EXPIRED': return 'Autorización Expirada';
      case 'REVOKED': return 'Autorización Revocada';
      case 'FORMAT_ERROR': return 'QR No Reconocido';
      default: return 'Error';
    }
  });

  readonly subtitle = computed(() => {
    const now = new Date();
    const time = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
    switch (this.resultType()) {
      case 'VALID': return `Escaneo exitoso a las ${time}`;
      case 'INVALID': return 'QR no reconocido o manipulado';
      case 'EXPIRED': return 'Fuera del rango de fechas autorizado';
      case 'REVOKED': return 'Cancelada por el administrador';
      case 'FORMAT_ERROR': return 'El código escaneado no es una autorización válida';
      default: return '';
    }
  });

  readonly serviceTypeLabel = computed(() => {
    const payload = this.qrPayload();
    if (!payload) return '';
    const labels: Record<string, string> = {
      GUEST: 'VISITANTE',
      DELIVERY: 'ENTREGA',
      SERVICE: 'SERVICIO',
      FAMILY: 'FAMILIAR'
    };
    return labels[payload.serviceType] ?? payload.serviceType;
  });

  onDismiss(): void {
    this.dismiss.emit();
  }

  onConfirmEntry(): void {
    this.confirmEntry.emit();
  }

  onDenyEntry(): void {
    this.denyEntry.emit();
  }

  onVehicleConfirm(matches: boolean): void {
    this.vehicleConfirmed.emit(matches);
  }
}
