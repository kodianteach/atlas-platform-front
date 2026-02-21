import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AnnouncementsService } from '../../../services/announcements.service';
import { Announcement, BroadcastMessage, Poll } from '@domain/models/announcement/announcement.model';
import { AnnouncementsHeaderComponent } from '../../ui/organisms/announcements-header/announcements-header.component';

interface Comment {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  timestamp: Date;
  likes: number;
}

@Component({
  selector: 'app-announcement-detail',
  standalone: true,
  imports: [DatePipe, AnnouncementsHeaderComponent],
  templateUrl: './announcement-detail.component.html',
  styleUrl: './announcement-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly announcementsService = inject(AnnouncementsService);

  readonly announcement = signal<Announcement | null>(null);
  readonly comments = signal<Comment[]>([]);
  readonly newComment = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnnouncement(id);
      this.loadComments();
    } else {
      this.error.set('ID de anuncio no válido');
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAnnouncement(id: string): void {
    this.announcementsService.getAnnouncements()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (announcements) => {
          const found = announcements.find(a => a.id === id) || null;
          this.announcement.set(found);
          if (!found) {
            this.error.set('Anuncio no encontrado');
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Error al cargar el anuncio');
          this.loading.set(false);
        }
      });
  }

  private loadComments(): void {
    this.comments.set([
      {
        id: '1',
        author: 'María García',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        content: '¡Excelente noticia! Me alegra mucho que estemos implementando estas mejoras.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12
      },
      {
        id: '2',
        author: 'Carlos Rodríguez',
        avatarUrl: 'https://i.pravatar.cc/150?img=8',
        content: '¿Cuándo estará disponible esta funcionalidad? Estoy muy interesado.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 8
      },
      {
        id: '3',
        author: 'Ana Martínez',
        avatarUrl: 'https://i.pravatar.cc/150?img=9',
        content: 'Gracias por mantener a la comunidad informada. ¡Sigan así!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        likes: 15
      }
    ]);
  }

  onBack(): void {
    this.router.navigate(['/announcements']);
  }

  onCommentInput(value: string): void {
    this.newComment.set(value);
  }

  onSubmitComment(): void {
    const text = this.newComment().trim();
    if (text) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Usuario Actual',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        content: text,
        timestamp: new Date(),
        likes: 0
      };
      this.comments.update(c => [comment, ...c]);
      this.newComment.set('');
    }
  }

  onLikeComment(commentId: string): void {
    this.comments.update(comments =>
      comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
    );
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Ahora mismo';
  }

  isBroadcast(): boolean {
    return this.announcement()?.type === 'broadcast';
  }

  isPoll(): boolean {
    return this.announcement()?.type === 'poll';
  }

  getBroadcast(): BroadcastMessage {
    return this.announcement() as BroadcastMessage;
  }

  getPoll(): Poll {
    return this.announcement() as Poll;
  }
}
