import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { PollOptionComponent } from '../../molecules/poll-option/poll-option.component';
import { Poll } from '@domain/models/announcement/announcement.model';

@Component({
  selector: 'app-poll-card',
  standalone: true,
  imports: [PollOptionComponent],
  templateUrl: './poll-card.component.html',
  styleUrl: './poll-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollCardComponent {
  readonly poll = input.required<Poll>();
  readonly voteClick = output<{ pollId: number; optionId: number }>();
  readonly viewDiscussionClick = output<number>();

  readonly timeRemaining = computed(() => {
    const endsAt = this.poll().endsAt;
    if (!endsAt) return 'Sin fecha límite';
    
    const now = Date.now();
    const end = new Date(endsAt).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Finalizada';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Finaliza en ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Finaliza en ${hours} hora${hours > 1 ? 's' : ''}`;

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Finaliza en ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  });

  onVote(optionId: number): void {
    this.voteClick.emit({ pollId: this.poll().id, optionId });
  }

  onViewDiscussion(): void {
    this.viewDiscussionClick.emit(this.poll().id);
  }

  isOptionSelected(optionId: number): boolean {
    return this.poll().userVote === optionId;
  }
}
