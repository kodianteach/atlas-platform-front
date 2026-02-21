import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-grant-authorization-card',
  standalone: true,
  imports: [IconComponent, ButtonComponent],
  templateUrl: './grant-authorization-card.component.html',
  styleUrl: './grant-authorization-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrantAuthorizationCardComponent {
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly icon = input<string>('');
  readonly createClick = output<void>();

  onCreateClick(): void {
    this.createClick.emit();
  }
}
