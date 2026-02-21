import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent {
  readonly label = input<string>('');
  readonly required = input<boolean>(false);
  readonly error = input<string>('');
  readonly hint = input<string>('');
  readonly id = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly value = input<string>('');
  readonly autocomplete = input<string>('');
  readonly icon = input<string>('');
  readonly errorMessage = input<string>('');

  readonly valueChange = output<string>();
  readonly blurred = output<void>();
  readonly focused = output<void>();

  readonly shouldRenderInternalInput = computed(() => !!this.id());

  onValueChange(value: string): void {
    this.valueChange.emit(value);
  }

  onBlur(): void {
    this.blurred.emit();
  }

  onFocus(): void {
    this.focused.emit();
  }
}
