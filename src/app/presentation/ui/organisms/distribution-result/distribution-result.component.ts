import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { UnitDistributeResponse } from '@domain/models/unit/unit.model';

@Component({
  selector: 'app-distribution-result',
  standalone: true,
  templateUrl: './distribution-result.component.html',
  styleUrl: './distribution-result.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DistributionResultComponent {
  readonly result = input.required<UnitDistributeResponse>();
  readonly createMore = output<void>();

  get isFullSuccess(): boolean {
    return this.result().rejectedCount === 0;
  }

  get isFullRejection(): boolean {
    return this.result().unitsCreated === 0 && this.result().rejectedCount > 0;
  }

  get isPartial(): boolean {
    return this.result().unitsCreated > 0 && this.result().rejectedCount > 0;
  }

  get statusIcon(): string {
    if (this.isFullSuccess) return 'bi-check-circle-fill';
    if (this.isFullRejection) return 'bi-x-circle-fill';
    return 'bi-exclamation-triangle-fill';
  }

  get statusClass(): string {
    if (this.isFullSuccess) return 'success';
    if (this.isFullRejection) return 'error';
    return 'warning';
  }

  onCreateMore(): void {
    this.createMore.emit();
  }
}
