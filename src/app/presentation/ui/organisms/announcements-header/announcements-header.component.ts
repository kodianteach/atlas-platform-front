import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-announcements-header',
  standalone: true,
  templateUrl: './announcements-header.component.html',
  styleUrl: './announcements-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementsHeaderComponent {
  readonly title = input<string>('Announcements');
  readonly showBackButton = input<boolean>(true);
  readonly showNotificationIcon = input<boolean>(true);
  readonly backClick = output<void>();
  readonly notificationClick = output<void>();

  onBackClick(): void {
    this.backClick.emit();
  }

  onNotificationClick(): void {
    this.notificationClick.emit();
  }
}
