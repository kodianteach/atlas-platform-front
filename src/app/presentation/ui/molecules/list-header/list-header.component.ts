import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BadgeComponent } from '../../atoms/badge/badge.component';

@Component({
  selector: 'app-list-header',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './list-header.component.html',
  styleUrl: './list-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListHeaderComponent {
  readonly title = input<string>('');
  readonly count = input<number>(0);
}
