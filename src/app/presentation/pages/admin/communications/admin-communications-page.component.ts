/**
 * AdminCommunicationsPageComponent
 * Main admin page for managing all communications (posts, polls, comments).
 * Combines stats, filters, post/poll cards, comment panel, and pagination.
 */
import { Component, ChangeDetectionStrategy, inject, signal, computed, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';
import { GlobalNotificationService } from '@infrastructure/services/global-notification.service';
import { AdminFilterBarComponent } from '@presentation/ui/molecules/admin-filter-bar/admin-filter-bar.component';
import { StatsCounterComponent } from '@presentation/ui/molecules/stats-counter/stats-counter.component';
import { AdminPostCardComponent } from '@presentation/ui/organisms/admin-post-card/admin-post-card.component';
import { AdminPollCardComponent } from '@presentation/ui/organisms/admin-poll-card/admin-poll-card.component';
import { AdminCommentPanelComponent } from '@presentation/ui/organisms/admin-comment-panel/admin-comment-panel.component';
import { PaginationComponent } from '@presentation/ui/atoms/pagination/pagination.component';
import { AdminBottomNavComponent } from '@presentation/ui/organisms/admin-bottom-nav/admin-bottom-nav.component';

import { GetAdminCommunicationsUseCase } from '@domain/use-cases/announcement/get-admin-communications.use-case';
import { ManageCommunicationsUseCase } from '@domain/use-cases/announcement/manage-communications.use-case';
import { GetCommunicationStatsUseCase } from '@domain/use-cases/announcement/get-communication-stats.use-case';

import {
  PostResponse,
  PollResponse,
  CommentResponse,
  CommunicationStatsResponse,
  PostPollFilterParams,
  PostRequest,
  PollRequest
} from '@domain/models/announcement/announcement.model';

@Component({
  selector: 'app-admin-communications',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    SlicePipe,
    FormsModule,
    AdminFilterBarComponent,
    StatsCounterComponent,
    AdminPostCardComponent,
    AdminPollCardComponent,
    AdminCommentPanelComponent,
    PaginationComponent,
    AdminBottomNavComponent
  ],
  templateUrl: './admin-communications-page.component.html',
  styleUrl: './admin-communications-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCommunicationsPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly getAdminCommunications = inject(GetAdminCommunicationsUseCase);
  private readonly manageCommunications = inject(ManageCommunicationsUseCase);
  private readonly getCommunicationStats = inject(GetCommunicationStatsUseCase);
  private readonly authService = inject(AuthenticationService);
  private readonly notify = inject(GlobalNotificationService);

  // State
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly posts = signal<PostResponse[]>([]);
  readonly polls = signal<PollResponse[]>([]);
  readonly stats = signal<CommunicationStatsResponse | null>(null);
  readonly totalPostPages = signal(0);
  readonly totalPollPages = signal(0);
  readonly totalPostElements = signal(0);
  readonly totalPollElements = signal(0);

  readonly filters = signal<PostPollFilterParams>({ page: 0, size: 10 });

  // Comment panel state
  readonly commentPanelOpen = signal(false);
  readonly selectedPostId = signal<number | null>(null);
  readonly comments = signal<CommentResponse[]>([]);
  readonly commentsLoading = signal(false);

  // Poll results panel state
  readonly pollResultsOpen = signal(false);
  readonly selectedPoll = signal<PollResponse | null>(null);

  // Flagged comments tab
  readonly showFlagged = signal(false);
  readonly flaggedComments = signal<CommentResponse[]>([]);

  // Active tab
  readonly activeTab = signal<'all' | 'posts' | 'polls' | 'flagged'>('all');

  // Create forms state
  readonly showCreatePostForm = signal(false);
  readonly showCreatePollForm = signal(false);
  readonly newPostTitle = signal('');
  readonly newPostContent = signal('');
  readonly newPostAllowComments = signal(true);
  readonly newPollTitle = signal('');
  readonly newPollDescription = signal('');
  readonly newPollOptions = signal<string[]>(['', '']);
  readonly newPollAllowMultiple = signal(false);
  readonly newPollAnonymous = signal(false);

  readonly canCreatePoll = computed(() => {
    return !!this.newPollTitle() && this.newPollOptions().filter(o => o.trim()).length >= 2;
  });

  readonly showPosts = computed(() => this.activeTab() !== 'polls' && this.activeTab() !== 'flagged');
  readonly showPolls = computed(() => this.activeTab() !== 'posts' && this.activeTab() !== 'flagged');
  readonly showFlaggedTab = computed(() => this.activeTab() === 'flagged');

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }

  // ========================
  // DATA LOADING
  // ========================

  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.getAdminCommunications.execute(this.filters())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.loading.set(false);
        if (result.success) {
          this.posts.set(result.data.posts.content);
          this.polls.set(result.data.polls.content);
          this.totalPostPages.set(result.data.posts.totalPages);
          this.totalPollPages.set(result.data.polls.totalPages);
          this.totalPostElements.set(result.data.posts.totalElements);
          this.totalPollElements.set(result.data.polls.totalElements);
        } else {
          this.error.set(result.error.message);
        }
      });
  }

  loadStats(): void {
    this.getCommunicationStats.execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.stats.set(result.data);
        }
      });
  }

  // ========================
  // FILTER ACTIONS
  // ========================

  onFiltersChange(filters: PostPollFilterParams): void {
    this.filters.set({ ...filters, page: 0, size: 10 });
    this.loadData();
  }

  onPageChange(page: number): void {
    this.filters.update(f => ({ ...f, page }));
    this.loadData();
  }

  onTabChange(tab: 'all' | 'posts' | 'polls' | 'flagged'): void {
    this.activeTab.set(tab);
    if (tab === 'flagged') {
      this.loadFlaggedComments();
    }
  }

  // ========================
  // POST ACTIONS
  // ========================

  onPublishPost(id: number): void {
    this.manageCommunications.publishPost(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Publicación publicada exitosamente');
          this.loadData();
          this.loadStats();
        } else {
          this.notify.error(result.error?.message || 'Error al publicar');
        }
      });
  }

  onArchivePost(id: number): void {
    this.manageCommunications.archivePost(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Publicación archivada');
          this.loadData();
          this.loadStats();
        } else {
          this.notify.error(result.error?.message || 'Error al archivar');
        }
      });
  }

  onReactivatePost(id: number): void {
    this.manageCommunications.reactivatePost(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Publicación reactivada');
          this.loadData();
          this.loadStats();
        } else {
          this.notify.error(result.error?.message || 'Error al reactivar');
        }
      });
  }

  onTogglePinPost(id: number): void {
    this.manageCommunications.togglePinPost(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success(result.data?.isPinned ? 'Publicación fijada' : 'Publicación desfijada');
          this.loadData();
        } else {
          this.notify.error(result.error?.message || 'Error al cambiar fijado');
        }
      });
  }

  onDeletePost(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
      this.manageCommunications.deletePost(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {
          if (result.success) {
            this.notify.success('Publicación eliminada');
            this.loadData();
            this.loadStats();
          } else {
            this.notify.error(result.error?.message || 'Error al eliminar');
          }
        });
    }
  }

  // ========================
  // POLL ACTIONS
  // ========================

  onActivatePoll(id: number): void {
    this.manageCommunications.activatePoll(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Encuesta activada');
          this.loadData();
          this.loadStats();
        } else {
          this.notify.error(result.error?.message || 'Error al activar encuesta');
        }
      });
  }

  onClosePoll(id: number): void {
    if (confirm('¿Estás seguro de cerrar esta encuesta? No se aceptarán más votos.')) {
      this.manageCommunications.closePoll(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {
          if (result.success) {
            this.notify.success('Encuesta cerrada');
            this.loadData();
            this.loadStats();
          } else {
            this.notify.error(result.error?.message || 'Error al cerrar encuesta');
          }
        });
    }
  }

  onViewPollResults(id: number): void {
    const poll = this.polls().find(p => p.id === id) || null;
    this.selectedPoll.set(poll);
    this.pollResultsOpen.set(true);
  }

  onClosePollResults(): void {
    this.pollResultsOpen.set(false);
    this.selectedPoll.set(null);
  }

  // ========================
  // COMMENT ACTIONS
  // ========================

  onViewComments(postId: number): void {
    this.selectedPostId.set(postId);
    this.commentPanelOpen.set(true);
    this.commentsLoading.set(true);

    this.manageCommunications.getAllCommentsByPost(postId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.commentsLoading.set(false);
        if (result.success) {
          this.comments.set(result.data);
        }
      });
  }

  onCloseCommentPanel(): void {
    this.commentPanelOpen.set(false);
    this.selectedPostId.set(null);
    this.comments.set([]);
  }

  onDeleteComment(commentId: number): void {
    this.manageCommunications.deleteComment(commentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Comentario eliminado');
          if (this.selectedPostId()) {
            this.onViewComments(this.selectedPostId()!);
          }
          this.loadData();
        } else {
          this.notify.error('Error al eliminar comentario');
        }
      });
  }

  onHideComment(commentId: number): void {
    this.manageCommunications.hideComment(commentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Comentario ocultado');
          if (this.selectedPostId()) {
            this.onViewComments(this.selectedPostId()!);
          }
        } else {
          this.notify.error('Error al ocultar comentario');
        }
      });
  }

  onApproveComment(commentId: number): void {
    this.manageCommunications.approveComment(commentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Comentario aprobado');
          if (this.selectedPostId()) {
            this.onViewComments(this.selectedPostId()!);
          }
          if (this.showFlaggedTab()) {
            this.loadFlaggedComments();
          }
        } else {
          this.notify.error('Error al aprobar comentario');
        }
      });
  }

  onReplyAsAdmin(event: { postId: number; content: string }): void {
    this.manageCommunications.replyAsAdmin({ postId: event.postId, content: event.content })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Respuesta enviada');
          if (this.selectedPostId()) {
            this.onViewComments(this.selectedPostId()!);
          }
          this.loadData();
        } else {
          this.notify.error('Error al responder');
        }
      });
  }

  // ========================
  // CREATE ACTIONS
  // ========================

  toggleCreatePostForm(): void {
    this.showCreatePostForm.update(v => !v);
    this.showCreatePollForm.set(false);
    if (!this.showCreatePostForm()) {
      this.resetPostForm();
    }
  }

  toggleCreatePollForm(): void {
    this.showCreatePollForm.update(v => !v);
    this.showCreatePostForm.set(false);
    if (!this.showCreatePollForm()) {
      this.resetPollForm();
    }
  }

  private getOrganizationId(): number {
    const user = this.authService.getUser();
    return user?.organizationId ? Number(user.organizationId) : 0;
  }

  onCreatePost(): void {
    const request: PostRequest = {
      organizationId: this.getOrganizationId(),
      title: this.newPostTitle(),
      content: this.newPostContent(),
      allowComments: this.newPostAllowComments()
    };
    this.manageCommunications.createPost(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Borrador creado exitosamente');
          this.resetPostForm();
          this.showCreatePostForm.set(false);
          this.loadData();
          this.loadStats();
        } else {
          this.notify.error(result.error?.message || 'Error al crear publicación');
        }
      });
  }

  onCreateAndPublishPost(): void {
    const request: PostRequest = {
      organizationId: this.getOrganizationId(),
      title: this.newPostTitle(),
      content: this.newPostContent(),
      allowComments: this.newPostAllowComments()
    };
    this.manageCommunications.createPost(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.manageCommunications.publishPost(result.data.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(pubResult => {
              if (pubResult.success) {
                this.notify.success('Publicación creada y publicada');
              } else {
                this.notify.warning('Borrador creado pero no se pudo publicar');
              }
              this.resetPostForm();
              this.showCreatePostForm.set(false);
              this.loadData();
              this.loadStats();
            });
        }
      });
  }

  onCreatePoll(): void {
    const validOptions = this.newPollOptions().filter(o => o.trim());
    if (validOptions.length < 2) return;
    const request: PollRequest = {
      organizationId: this.getOrganizationId(),
      title: this.newPollTitle(),
      description: this.newPollDescription() || undefined,
      allowMultiple: this.newPollAllowMultiple(),
      isAnonymous: this.newPollAnonymous(),
      options: validOptions
    };
    this.manageCommunications.createPoll(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.notify.success('Encuesta creada exitosamente');
          this.resetPollForm();
          this.showCreatePollForm.set(false);
          this.loadData();
          this.loadStats();
        } else {
          this.notify.error(result.error?.message || 'Error al crear encuesta');
        }
      });
  }

  addPollOption(): void {
    this.newPollOptions.update(opts => [...opts, '']);
  }

  removePollOption(index: number): void {
    this.newPollOptions.update(opts => opts.filter((_, i) => i !== index));
  }

  updatePollOption(index: number, value: string): void {
    this.newPollOptions.update(opts => {
      const updated = [...opts];
      updated[index] = value;
      return updated;
    });
  }

  private resetPostForm(): void {
    this.newPostTitle.set('');
    this.newPostContent.set('');
    this.newPostAllowComments.set(true);
  }

  private resetPollForm(): void {
    this.newPollTitle.set('');
    this.newPollDescription.set('');
    this.newPollOptions.set(['', '']);
    this.newPollAllowMultiple.set(false);
    this.newPollAnonymous.set(false);
  }

  // ========================
  // FLAGGED COMMENTS
  // ========================

  loadFlaggedComments(): void {
    const organizationId = this.getOrganizationId();
    this.manageCommunications.getFlaggedComments(organizationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.success) {
          this.flaggedComments.set(result.data);
        }
      });
  }
}
