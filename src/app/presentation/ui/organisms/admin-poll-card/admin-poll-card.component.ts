/**
 * AdminPollCardComponent - Card for managing a poll in the admin communications panel.
 * Displays poll info with action buttons and vote stats.
 */
import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { PollResponse } from '@domain/models/announcement/announcement.model';

@Component({
  selector: 'app-admin-poll-card',
  standalone: true,
  imports: [DatePipe, SlicePipe],
  templateUrl: './admin-poll-card.component.html',
  styleUrl: './admin-poll-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPollCardComponent {
  readonly poll = input.required<PollResponse>();

  readonly activateAction = output<number>();
  readonly closeAction = output<number>();
  readonly viewResultsAction = output<number>();

  readonly statusLabel = computed(() => {
    const map: Record<string, string> = {
      DRAFT: 'Borrador',
      ACTIVE: 'Activa',
      CLOSED: 'Cerrada'
    };
    return map[this.poll().status] || this.poll().status;
  });

  readonly statusClass = computed(() => {
    const map: Record<string, string> = {
      DRAFT: 'poll-card__tag--draft',
      ACTIVE: 'poll-card__tag--active',
      CLOSED: 'poll-card__tag--closed'
    };
    return map[this.poll().status] || 'poll-card__tag--closed';
  });

  readonly canActivate = computed(() => this.poll().status === 'DRAFT');
  readonly canClose = computed(() => this.poll().status === 'ACTIVE');

  onActivate(): void { this.activateAction.emit(this.poll().id); }
  onClose(): void { this.closeAction.emit(this.poll().id); }
  onViewResults(): void { this.viewResultsAction.emit(this.poll().id); }
}
