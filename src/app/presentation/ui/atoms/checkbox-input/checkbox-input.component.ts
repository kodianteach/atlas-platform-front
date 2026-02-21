import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';

@Component({
  selector: 'app-checkbox-input',
  standalone: true,
  templateUrl: './checkbox-input.component.html',
  styleUrl: './checkbox-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxInputComponent {
  readonly checked = model<boolean>(false);
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);

  onCheckedChange(newValue: boolean): void {
    this.checked.set(newValue);
  }
}
