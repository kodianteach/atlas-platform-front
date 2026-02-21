import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-quick-action-card',
  standalone: true,
  templateUrl: './quick-action-card.component.html',
  styleUrl: './quick-action-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickActionCardComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('');
  readonly backgroundColor = input<string>('#e3f2fd');
  readonly iconColor = input<string>('');

  readonly cardClick = output<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }
}
