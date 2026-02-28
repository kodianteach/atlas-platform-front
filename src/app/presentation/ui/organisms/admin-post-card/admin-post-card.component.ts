/**
 * AdminPostCardComponent - Card for managing a post in the admin communications panel.
 * Displays post info with context-sensitive action buttons based on status.
 */
import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { PostResponse } from '@domain/models/announcement/announcement.model';

@Component({
  selector: 'app-admin-post-card',
  standalone: true,
  imports: [DatePipe, SlicePipe],
  templateUrl: './admin-post-card.component.html',
  styleUrl: './admin-post-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPostCardComponent {
  readonly post = input.required<PostResponse>();

  readonly publishAction = output<number>();
  readonly archiveAction = output<number>();
  readonly reactivateAction = output<number>();
  readonly togglePinAction = output<number>();
  readonly deleteAction = output<number>();
  readonly viewCommentsAction = output<number>();

  readonly statusLabel = computed(() => {
    const map: Record<string, string> = {
      DRAFT: 'Borrador',
      PUBLISHED: 'Publicado',
      ARCHIVED: 'Archivado'
    };
    return map[this.post().status] || this.post().status;
  });

  readonly statusClass = computed(() => {
    const map: Record<string, string> = {
      DRAFT: 'post-card__tag--draft',
      PUBLISHED: 'post-card__tag--published',
      ARCHIVED: 'post-card__tag--archived'
    };
    return map[this.post().status] || 'post-card__tag--archived';
  });

  readonly typeLabel = computed(() => {
    const map: Record<string, string> = {
      ANNOUNCEMENT: 'Anuncio',
      NEWS: 'Noticia',
      AD: 'Publicidad'
    };
    return map[this.post().type] || this.post().type;
  });

  readonly canPublish = computed(() => this.post().status === 'DRAFT');
  readonly canArchive = computed(() => this.post().status === 'PUBLISHED');
  readonly canReactivate = computed(() => this.post().status === 'ARCHIVED');
  readonly canTogglePin = computed(() => this.post().status === 'PUBLISHED');

  onPublish(): void { this.publishAction.emit(this.post().id); }
  onArchive(): void { this.archiveAction.emit(this.post().id); }
  onReactivate(): void { this.reactivateAction.emit(this.post().id); }
  onTogglePin(): void { this.togglePinAction.emit(this.post().id); }
  onDelete(): void { this.deleteAction.emit(this.post().id); }
  onViewComments(): void { this.viewCommentsAction.emit(this.post().id); }
}
