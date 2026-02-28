/**
 * StatsCounterComponent - Displays communication statistics in counter cards.
 */
import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommunicationStatsResponse } from '@domain/models/announcement/announcement.model';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-stats-counter',
  standalone: true,
  templateUrl: './stats-counter.component.html',
  styleUrl: './stats-counter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsCounterComponent {
  readonly stats = input<CommunicationStatsResponse | null>(null);

  readonly statCards = computed<StatCard[]>(() => {
    const s = this.stats();
    if (!s) return [];

    const totalPosts = Object.values(s.postsByStatus).reduce((sum, v) => sum + v, 0);
    const totalPolls = Object.values(s.pollsByStatus).reduce((sum, v) => sum + v, 0);
    const publishedPosts = s.postsByStatus['PUBLISHED'] || 0;
    const activePolls = s.pollsByStatus['ACTIVE'] || 0;

    return [
      { label: 'Publicaciones', value: totalPosts, icon: 'bi-megaphone', color: '#4f46e5' },
      { label: 'Publicadas', value: publishedPosts, icon: 'bi-check-circle', color: '#16a34a' },
      { label: 'Encuestas', value: totalPolls, icon: 'bi-bar-chart', color: '#0891b2' },
      { label: 'Activas', value: activePolls, icon: 'bi-lightning', color: '#d97706' },
      { label: 'Comentarios', value: s.totalComments, icon: 'bi-chat-dots', color: '#7c3aed' },
      { label: 'Participación', value: Math.round(s.participationRate), icon: 'bi-people', color: '#dc2626' }
    ];
  });
}
