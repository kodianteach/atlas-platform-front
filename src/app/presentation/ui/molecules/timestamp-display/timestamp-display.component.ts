import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-timestamp-display',
  standalone: true,
  templateUrl: './timestamp-display.component.html',
  styleUrl: './timestamp-display.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimestampDisplayComponent {
  readonly timestamp = input.required<Date>();

  readonly formattedTime = computed(() => {
    const now = new Date();
    const date = new Date(this.timestamp());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const timeStr = this.formatTime12Hour(date);

    if (messageDate.getTime() === today.getTime()) return `Today, ${timeStr}`;
    if (messageDate.getTime() === yesterday.getTime()) return `Yesterday, ${timeStr}`;
    return `${this.formatDate(date)}, ${timeStr}`;
  });

  private formatTime12Hour(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${hours}:${minutesStr} ${ampm}`;
  }

  private formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
}
