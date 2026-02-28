import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
import { Announcement, BroadcastMessage, Poll, PostResponse, PollResponse, CommentResponse } from '@domain/models/announcement/announcement.model';
import { AnnouncementsHeaderComponent } from '../../ui/organisms/announcements-header/announcements-header.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { GlobalNotificationService } from '@infrastructure/services/global-notification.service';

interface DisplayComment {
  id: string;
  authorId: number;
  author: string;
  avatarUrl: string;
  content: string;
  timestamp: Date;
  likes: number;
  isOwn: boolean;
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
  private readonly gateway = inject(AnnouncementGateway);
  private readonly authService = inject(AuthenticationService);
  private readonly notify = inject(GlobalNotificationService);

  readonly announcement = signal<Announcement | null>(null);
  readonly comments = signal<DisplayComment[]>([]);
  readonly newComment = signal('');
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  /** Current user info */
  private readonly currentUserId = signal<number>(0);
  readonly isAdmin = signal(false);

  /** True if comments are allowed on this announcement */
  readonly commentsAllowed = computed(() => {
    const ann = this.announcement();
    if (!ann) return false;
    if (ann.type === 'poll') return true;
    return 'allowComments' in ann && Boolean(ann.allowComments);
  });

  private readonly destroy$ = new Subject<void>();
  private currentPostId = 0;

  ngOnInit(): void {
    // Load current user context
    const user = this.authService.getUser();
    if (user) {
      this.currentUserId.set(Number(user.id) || 0);
      this.isAdmin.set(user.role === 'ADMIN_ATLAS' || user.roles?.includes('ADMIN_ATLAS') === true);
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.currentPostId = id;
      this.loadAnnouncement(id);
      this.loadComments(id);
    } else {
      this.error.set('ID de anuncio no válido');
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAnnouncement(id: number): void {
    // Try loading as post first, then as poll
    this.gateway.getPostById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.announcement.set(this.mapPostToBroadcast(result.data));
          } else {
            // Try as poll
            this.loadAsPoll(id);
            return;
          }
          this.loading.set(false);
        },
        error: () => {
          this.loadAsPoll(id);
        }
      });
  }

  private loadAsPoll(id: number): void {
    this.gateway.getPollById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.announcement.set(this.mapPollResponseToPoll(result.data));
          } else {
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

  private mapPostToBroadcast(post: PostResponse): BroadcastMessage {
    return {
      id: post.id,
      type: 'broadcast',
      createdAt: post.createdAt,
      priority: post.isPinned ? 10 : 0,
      title: post.title,
      description: post.content,
      previewText: post.content.substring(0, 150),
      postType: post.type,
      isPinned: post.isPinned,
      allowComments: post.allowComments,
      status: post.status,
      authorId: post.authorId,
      organizationId: post.organizationId,
      publishedAt: post.publishedAt,
      isUrgent: post.isPinned,
      backgroundColor: '#ffffff',
      relatedUsers: []
    };
  }

  private mapPollResponseToPoll(poll: PollResponse): Poll {
    return {
      id: poll.id,
      type: 'poll',
      createdAt: poll.createdAt,
      priority: 5,
      title: poll.title,
      question: poll.description || poll.title,
      icon: '📊',
      status: poll.status,
      endsAt: poll.endsAt,
      options: (poll.options || []).map(o => ({
        id: o.id,
        text: o.optionText,
        votes: o.voteCount,
        percentage: o.percentage
      })),
      totalVotes: poll.totalVotes,
      allowMultiple: poll.allowMultiple,
      isAnonymous: poll.isAnonymous,
      organizationId: poll.organizationId,
      authorId: poll.authorId,
      discussionId: ''
    };
  }

  private loadComments(postId: number): void {
    const admin = this.isAdmin();

    // Admin uses the admin endpoint that returns ALL comments (including hidden/flagged).
    // Owners use the normal endpoint and see only their own.
    const comments$ = admin
      ? this.gateway.getAllCommentsByPost(postId)
      : this.gateway.getComments(postId);

    comments$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            const userId = this.currentUserId();
            // Admin sees everything; owner sees only own comments
            const filtered = admin
              ? result.data
              : result.data.filter(c => c.authorId === userId);

            this.comments.set(filtered.map(c => this.mapComment(c)));
          }
        }
      });
  }

  private mapComment(c: CommentResponse): DisplayComment {
    const userId = this.currentUserId();
    return {
      id: String(c.id),
      authorId: c.authorId,
      author: c.authorId === userId ? 'Tú' : `Usuario ${c.authorId}`,
      avatarUrl: `https://i.pravatar.cc/150?img=${c.authorId % 70}`,
      content: c.content,
      timestamp: new Date(c.createdAt),
      likes: 0,
      isOwn: c.authorId === userId
    };
  }

  onBack(): void {
    this.router.navigate(['/announcements']);
  }

  onCommentInput(value: string): void {
    this.newComment.set(value);
  }

  onSubmitComment(): void {
    const text = this.newComment().trim();
    if (!text || this.submitting()) return;

    this.submitting.set(true);
    this.gateway.createComment({ postId: this.currentPostId, content: text })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.submitting.set(false);
          if (result.success) {
            this.comments.update(c => [this.mapComment(result.data), ...c]);
            this.newComment.set('');
            this.notify.success('Comentario publicado');
          } else {
            this.notify.error('Error al publicar el comentario');
          }
        },
        error: () => {
          this.submitting.set(false);
          this.notify.error('Error al publicar el comentario');
        }
      });
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
