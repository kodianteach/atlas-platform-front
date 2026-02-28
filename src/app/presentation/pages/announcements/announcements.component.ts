import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, EMPTY, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
import { Announcement, BroadcastMessage, PostResponse, PollResponse, Poll } from '@domain/models/announcement/announcement.model';
import { BottomNavComponent } from '../../ui/organisms/bottom-nav/bottom-nav.component';
import { AuthorizationFormComponent } from '../../ui/organisms/authorization-form/authorization-form.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { GlobalNotificationService } from '@infrastructure/services/global-notification.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    AsyncPipe,
    BottomNavComponent,
    AuthorizationFormComponent
  ],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementsComponent implements OnInit {
  private readonly gateway = inject(AnnouncementGateway);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);
  private readonly notify = inject(GlobalNotificationService);

  /** Organization ID from auth context */
  private readonly organizationId = signal(0);

  announcements$!: Observable<Announcement[]>;
  private readonly allAnnouncements = signal<Announcement[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showFormOverlay = signal(false);
  readonly activeTab = signal<'all' | 'posts' | 'polls'>('all');
  private readonly votedOptions = signal<Set<number>>(new Set());

  readonly filteredAnnouncements = computed(() => {
    const tab = this.activeTab();
    const all = this.allAnnouncements();
    if (tab === 'posts') return all.filter(a => a.type === 'broadcast');
    if (tab === 'polls') return all.filter(a => a.type === 'poll');
    return all;
  });

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user?.organizationId) {
      this.organizationId.set(Number(user.organizationId));
    }
    this.loadAnnouncements();
  }

  setTab(tab: 'all' | 'posts' | 'polls'): void {
    this.activeTab.set(tab);
  }

  isOptionSelected(optionId: number): boolean {
    return this.votedOptions().has(optionId);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `Hace ${diffHrs}h`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  }

  private loadAnnouncements(): void {
    this.loading.set(true);
    this.error.set(null);
    const orgId = this.organizationId();

    this.announcements$ = forkJoin({
      posts: this.gateway.getPosts(orgId),
      polls: this.gateway.getActivePolls(orgId)
    }).pipe(
      map(({ posts, polls }) => {
        const announcements: Announcement[] = [];
        if (posts.success) {
          announcements.push(...posts.data.map(p => this.mapPostToBroadcast(p)));
        }
        if (polls.success) {
          announcements.push(...polls.data.map(p => this.mapPollResponseToPoll(p)));
        }
        // Sort: pinned first, then by date desc
        announcements.sort((a, b) => {
          const aPinned = (a as BroadcastMessage).isPinned ? 1 : 0;
          const bPinned = (b as BroadcastMessage).isPinned ? 1 : 0;
          if (aPinned !== bPinned) return bPinned - aPinned;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.loading.set(false);
        return announcements;
      }),
      tap(announcements => this.allAnnouncements.set(announcements)),
      catchError(() => {
        this.loading.set(false);
        this.error.set('Error al cargar las publicaciones. Intenta nuevamente.');
        return of([]);
      })
    );
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

  onReadMore(announcementId: number): void {
    this.router.navigate(['/announcements', announcementId]);
  }

  onVote(event: { pollId: number; optionId: number }): void {
    this.gateway.votePoll(event.pollId, { optionId: event.optionId }).pipe(
      catchError(() => {
        this.notify.error('Error al registrar el voto. Intenta nuevamente.');
        return EMPTY;
      })
    ).subscribe(() => {
      this.notify.success('Voto registrado exitosamente');
      this.loadAnnouncements();
    });
  }

  onViewDiscussion(pollId: number): void {
    this.router.navigate(['/polls', pollId, 'discussion']);
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  onNotifications(): void {
    this.router.navigate(['/notifications']);
  }

  onCenterAction(): void {
    this.showFormOverlay.set(true);
  }

  onFormCancel(): void {
    this.showFormOverlay.set(false);
  }

  onAuthorizationCreated(_authorization: any): void {
    this.showFormOverlay.set(false);
  }

  onFormError(_errorMessage: string): void {
    // Error handled by the form component toast
  }

  retryLoad(): void {
    this.loadAnnouncements();
  }

  isBroadcast(announcement: Announcement): boolean {
    return announcement.type === 'broadcast';
  }

  isPoll(announcement: Announcement): boolean {
    return announcement.type === 'poll';
  }
}
