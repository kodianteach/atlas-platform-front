import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { ProgressBarComponent } from '../../atoms/progress-bar/progress-bar.component';
import { PollOption } from '@domain/models/announcement/announcement.model';

@Component({
  selector: 'app-poll-option',
  standalone: true,
  imports: [ProgressBarComponent],
  templateUrl: './poll-option.component.html',
  styleUrl: './poll-option.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollOptionComponent {
  readonly option = input.required<PollOption>();
  readonly totalVotes = input<number>(0);
  readonly isSelected = input<boolean>(false);
  readonly optionClick = output<number>();

  readonly percentage = computed(() => {
    const total = this.totalVotes();
    if (total === 0) return 0;
    return Math.round((this.option().votes / total) * 1000) / 10;
  });

  onOptionClick(): void {
    this.optionClick.emit(this.option().id);
  }
}
