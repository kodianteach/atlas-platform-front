import { Component, ChangeDetectionStrategy, model, output } from '@angular/core';
import { ServiceType } from '@domain/models/authorization/authorization.model';

/**
 * Service Type Selector - Selects the type of service for an authorization
 * HU #6 - Replaces EntryTypeSelectorComponent with new service types
 */
@Component({
  selector: 'app-service-type-selector',
  standalone: true,
  template: `
    <div class="service-type-container">
      <div
        class="type-card"
        [class.selected]="selectedType() === 'VISIT'"
        (click)="onTypeChange('VISIT')">
        <div class="icon-circle">
          <i class="bi bi-person-fill"></i>
        </div>
        <span class="type-label">Visita</span>
      </div>

      <div
        class="type-card"
        [class.selected]="selectedType() === 'DELIVERY'"
        (click)="onTypeChange('DELIVERY')">
        <div class="icon-circle">
          <i class="bi bi-truck-front-fill"></i>
        </div>
        <span class="type-label">Delivery</span>
      </div>

      <div
        class="type-card"
        [class.selected]="selectedType() === 'TECHNICIAN'"
        (click)="onTypeChange('TECHNICIAN')">
        <div class="icon-circle">
          <i class="bi bi-tools"></i>
        </div>
        <span class="type-label">Técnico</span>
      </div>

      <div
        class="type-card"
        [class.selected]="selectedType() === 'OTHER'"
        (click)="onTypeChange('OTHER')">
        <div class="icon-circle">
          <i class="bi bi-three-dots"></i>
        </div>
        <span class="type-label">Otro</span>
      </div>
    </div>
  `,
  styles: [`
    .service-type-container {
      display: flex;
      gap: 12px;
      justify-content: center;
      padding: 16px 0;
      flex-wrap: wrap;
    }

    .type-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 72px;
      background: #f8f9fa;
      border: 2px solid transparent;
    }

    .type-card:hover {
      background: #e9ecef;
    }

    .type-card.selected {
      background: #e8f5e9;
      border-color: #4caf50;
    }

    .icon-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #dee2e6;
      transition: background 0.2s ease;
    }

    .type-card.selected .icon-circle {
      background: #4caf50;
      color: white;
    }

    .icon-circle i {
      font-size: 1.25rem;
    }

    .type-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #495057;
    }

    .type-card.selected .type-label {
      color: #2e7d32;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceTypeSelectorComponent {
  readonly selectedType = model<ServiceType>('VISIT');
  readonly typeChange = output<ServiceType>();

  onTypeChange(type: ServiceType): void {
    this.selectedType.set(type);
    this.typeChange.emit(type);
  }
}
