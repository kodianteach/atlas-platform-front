import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { QRScanResult } from '@domain/models/entry/entry.model';

@Component({
  selector: 'app-access-granted-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './access-granted-modal.component.html',
  styleUrl: './access-granted-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessGrantedModalComponent {
  readonly visible = input<boolean>(false);
  readonly scanResult = input<QRScanResult | null>(null);
  readonly dismiss = output<void>();
  readonly openGate = output<void>();

  readonly visitorTypeLabel = computed(() => {
    const result = this.scanResult();
    if (!result) return '';
    const labels: Record<string, string> = {
      resident: 'RESIDENTE',
      guest: 'VISITANTE',
      service: 'SERVICIO',
      delivery: 'ENTREGA'
    };
    return labels[result.visitorType] ?? '';
  });

  readonly visitorTypeBadgeClass = computed(() => {
    const result = this.scanResult();
    if (!result) return '';
    const classes: Record<string, string> = {
      resident: 'badge-resident',
      guest: 'badge-visitor',
      service: 'badge-service',
      delivery: 'badge-delivery'
    };
    return classes[result.visitorType] ?? '';
  });

  onDismiss(): void {
    this.dismiss.emit();
  }

  onOpenGate(): void {
    this.openGate.emit();
  }
}
