import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly id = input.required<string>();
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly hasError = input<boolean>(false);
  readonly errorId = input<string | undefined>(undefined);
  readonly value = input<string>('');
  readonly autocomplete = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly blurred = output<void>();
  readonly focused = output<void>();

  readonly isFocused = signal(false);

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.blurred.emit();
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.focused.emit();
  }
}
