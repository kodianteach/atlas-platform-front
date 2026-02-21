import { Component, ChangeDetectionStrategy, input, output, model } from '@angular/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInputComponent {
  readonly value = model<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<string>('text');
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
