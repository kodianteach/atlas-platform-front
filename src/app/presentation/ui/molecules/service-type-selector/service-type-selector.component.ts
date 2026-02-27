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
      gap: 16px;
      justify-content: center;
      padding: 8px 0 24px 0;
      flex-wrap: wrap;
    }

    .type-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 90px;
      background: var(--bg-primary, #FFFFFF);
      border: 2px solid var(--border-color, #E5E7EB);
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }

    .type-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.05);
      border-color: var(--border-hover, #D1D5DB);
    }

    .type-card.selected {
      background: rgba(var(--color-primary-rgb, 255, 140, 97), 0.08);
      border-color: var(--color-primary, #FF8C61);
      box-shadow: 0 4px 12px rgba(var(--color-primary-rgb, 255, 140, 97), 0.2);
    }

    .icon-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--bg-tertiary, #F3F4F6);
      color: var(--text-secondary, #6B7280);
      transition: all 0.25s ease;
    }

    .type-card.selected .icon-circle {
      background: var(--color-primary, #FF8C61);
      color: white;
      transform: scale(1.1);
    }

    .icon-circle i {
      font-size: 1.5rem;
    }

    .type-label {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-secondary, #6B7280);
      transition: color 0.2s ease;
    }

    .type-card.selected .type-label {
      color: var(--color-primary-dark, #FF6B3D);
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

