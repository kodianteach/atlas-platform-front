import { Component, ChangeDetectionStrategy, input, output, model } from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select-input',
  standalone: true,
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectInputComponent {
  readonly id = input<string>('');
  readonly placeholder = input<string>('Select an option');
  readonly options = input<SelectOption[]>([]);
  readonly value = model<string>('');
  readonly disabled = input<boolean>(false);
  readonly error = input<boolean>(false);

  readonly blurred = output<void>();
  readonly focused = output<void>();

  onValueChange(newValue: string): void {
    this.value.set(newValue);
  }

  onBlur(): void {
    this.blurred.emit();
  }

  onFocus(): void {
    this.focused.emit();
  }
}
