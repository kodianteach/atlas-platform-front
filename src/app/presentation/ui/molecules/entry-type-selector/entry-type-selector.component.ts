import { Component, ChangeDetectionStrategy, model, output } from '@angular/core';

export type EntryType = 'visitor' | 'courier' | 'service';

@Component({
  selector: 'app-entry-type-selector',
  standalone: true,
  templateUrl: './entry-type-selector.component.html',
  styleUrl: './entry-type-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryTypeSelectorComponent {
  readonly selectedType = model<EntryType>('visitor');
  readonly typeChange = output<EntryType>();

  onTypeChange(type: EntryType): void {
    this.selectedType.set(type);
    this.typeChange.emit(type);
  }
}
