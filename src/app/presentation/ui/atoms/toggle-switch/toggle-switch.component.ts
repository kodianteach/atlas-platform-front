import { Component, ChangeDetectionStrategy, input, output, model } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleSwitchComponent {
  readonly checked = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('Toggle switch');

  readonly toggled = output<boolean>();

  onToggle(): void {
    if (!this.disabled()) {
      const newValue = !this.checked();
      this.checked.set(newValue);
      this.toggled.emit(newValue);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onToggle();
    }
  }
}
