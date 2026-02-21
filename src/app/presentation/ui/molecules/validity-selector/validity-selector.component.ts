import { Component, ChangeDetectionStrategy, model, output } from '@angular/core';

interface ValidityOption {
  label: string;
  minutes: number;
}

@Component({
  selector: 'app-validity-selector',
  standalone: true,
  templateUrl: './validity-selector.component.html',
  styleUrl: './validity-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValiditySelectorComponent {
  readonly selectedPeriod = model<number>(60);
  readonly periodChange = output<number>();

  readonly validityOptions: ValidityOption[] = [
    { label: '1 hora', minutes: 60 },
    { label: '2 horas', minutes: 120 },
    { label: '4 horas', minutes: 240 },
    { label: '8 horas', minutes: 480 },
    { label: '24 horas', minutes: 1440 }
  ];

  onPeriodChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const minutes = parseInt(target.value, 10);
    this.selectedPeriod.set(minutes);
    this.periodChange.emit(minutes);
  }
}
