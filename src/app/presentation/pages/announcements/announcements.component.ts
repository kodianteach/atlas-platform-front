import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnnouncementsService } from '../../../services/announcements.service';
import { Announcement } from '@domain/models/announcement/announcement.model';
import { AnnouncementsHeaderComponent } from '../../ui/organisms/announcements-header/announcements-header.component';
import { BroadcastCardComponent } from '../../ui/organisms/broadcast-card/broadcast-card.component';
import { PollCardComponent } from '../../ui/organisms/poll-card/poll-card.component';
import { BottomNavComponent } from '../../ui/organisms/bottom-nav/bottom-nav.component';
import { AuthorizationFormComponent } from '../../ui/organisms/authorization-form/authorization-form.component';
import { AuthorizationFormValue } from '@domain/models/authorization/authorization.model';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    AsyncPipe,
    AnnouncementsHeaderComponent,
    BroadcastCardComponent,
    PollCardComponent,
    BottomNavComponent,
    AuthorizationFormComponent
  ],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnouncementsComponent implements OnInit {
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly router = inject(Router);

  announcements$!: Observable<Announcement[]>;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showFormOverlay = signal(false);

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  private loadAnnouncements(): void {
    this.loading.set(true);
    this.error.set(null);

    this.announcements$ = this.announcementsService.getAnnouncements().pipe(
      catchError(err => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to load announcements. Please try again.');
        return EMPTY;
      })
    );

    this.announcements$.subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to load announcements. Please try again.');
      }
    });
  }

  onReadMore(announcementId: string): void {
    this.router.navigate(['/announcements', announcementId]);
  }

  onVote(event: { pollId: string; optionId: string }): void {
    this.announcementsService.votePoll(event.pollId, event.optionId).pipe(
      catchError(err => {
        this.error.set(err.message || 'Failed to register vote. Please try again.');
        return EMPTY;
      })
    ).subscribe(() => this.loadAnnouncements());
  }

  onViewDiscussion(pollId: string): void {
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

  onFormSubmit(_formValue: AuthorizationFormValue): void {
    this.showFormOverlay.set(false);
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
