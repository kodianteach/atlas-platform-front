/**
 * Get Announcements Use Case
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
import { Announcement } from '@domain/models/announcement/announcement.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class GetAnnouncementsUseCase {
  private readonly announcementGateway = inject(AnnouncementGateway);

  execute(): Observable<Result<Announcement[]>> {
    return this.announcementGateway.getAnnouncements().pipe(
      catchError(error => of(failure<Announcement[]>({
        code: 'GET_ANNOUNCEMENTS_ERROR',
        message: error.message || 'Error loading announcements',
        timestamp: new Date()
      })))
    );
  }
}
