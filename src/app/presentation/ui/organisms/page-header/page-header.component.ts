import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {
  readonly title = input<string>('');
  readonly showBackButton = input<boolean>(false);
  readonly showHistoryButton = input<boolean>(false);

  readonly backClick = output<void>();
  readonly historyClick = output<void>();

  onBackClick(): void {
    this.backClick.emit();
  }

  onHistoryClick(): void {
    this.historyClick.emit();
  }
}
