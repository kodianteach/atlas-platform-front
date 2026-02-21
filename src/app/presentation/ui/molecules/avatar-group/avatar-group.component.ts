import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { AvatarComponent } from '../../atoms/avatar/avatar.component';
import { AnnouncementUser } from '@domain/models/announcement/announcement.model';

@Component({
  selector: 'app-avatar-group',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './avatar-group.component.html',
  styleUrl: './avatar-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarGroupComponent {
  readonly users = input<AnnouncementUser[]>([]);
  readonly maxVisible = input<number>(4);
  readonly groupClick = output<void>();

  readonly visibleUsers = computed(() =>
    this.users()?.slice(0, this.maxVisible()) || []
  );

  readonly remainingCount = computed(() => {
    if (!this.users()) return 0;
    const remaining = this.users().length - this.maxVisible();
    return remaining > 0 ? remaining : 0;
  });

  onGroupClick(): void {
    this.groupClick.emit();
  }
}
