import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Porter } from '@domain/models/porter/porter.model';

@Component({
  selector: 'app-porter-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './porter-list.component.html',
  styleUrl: './porter-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PorterListComponent {
  readonly porters = input.required<Porter[]>();
  readonly regenerateUrl = output<number>();

  getPorterTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'PORTERO_GENERAL': 'General',
      'PORTERO_DELIVERY': 'Delivery'
    };
    return labels[type] || type;
  }

  getPorterTypeIcon(type: string): string {
    return type === 'PORTERO_DELIVERY' ? 'bi-box-seam' : 'bi-shield-check';
  }

  onRegenerateUrl(porterId: number): void {
    this.regenerateUrl.emit(porterId);
  }

  formatDate(date?: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
