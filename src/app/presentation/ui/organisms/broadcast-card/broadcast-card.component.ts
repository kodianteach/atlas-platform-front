import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { TimestampDisplayComponent } from '../../molecules/timestamp-display/timestamp-display.component';
import { AvatarGroupComponent } from '../../molecules/avatar-group/avatar-group.component';
import { BroadcastMessage } from '@domain/models/announcement/announcement.model';

@Component({
  selector: 'app-broadcast-card',
  standalone: true,
  imports: [BadgeComponent, TimestampDisplayComponent, AvatarGroupComponent],
  templateUrl: './broadcast-card.component.html',
  styleUrl: './broadcast-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BroadcastCardComponent {
  readonly broadcast = input.required<BroadcastMessage>();
  readonly readMoreClick = output<number>();

  onReadMoreClick(): void {
    this.readMoreClick.emit(this.broadcast().id);
  }
}
