/**
 * Announcement Adapter - Implements AnnouncementGateway for HTTP operations
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
import { Announcement } from '@domain/models/announcement/announcement.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AnnouncementAdapter extends AnnouncementGateway {
  private readonly http = inject(HttpClient);

  private readonly ANNOUNCEMENTS_ENDPOINT = `${environment.apiUrl}/announcements`;

  override getAnnouncements(): Observable<Result<Announcement[]>> {
    return this.http.get<Announcement[]>(this.ANNOUNCEMENTS_ENDPOINT).pipe(
      map(announcements => success(announcements)),
      catchError(error => of(failure<Announcement[]>({
        code: 'GET_ANNOUNCEMENTS_ERROR',
        message: error.message || 'Error loading announcements',
        timestamp: new Date()
      })))
    );
  }

  override getAnnouncementById(id: string): Observable<Result<Announcement>> {
    return this.http.get<Announcement>(`${this.ANNOUNCEMENTS_ENDPOINT}/${id}`).pipe(
      map(announcement => success(announcement)),
      catchError(error => of(failure<Announcement>({
        code: 'GET_ANNOUNCEMENT_ERROR',
        message: error.message || 'Error loading announcement',
        timestamp: new Date()
      })))
    );
  }

  override votePoll(pollId: string, optionId: string): Observable<Result<void>> {
    return this.http.post<void>(`${this.ANNOUNCEMENTS_ENDPOINT}/polls/${pollId}/vote`, { optionId }).pipe(
      map(() => success(undefined as unknown as void)),
      catchError(error => of(failure<void>({
        code: 'VOTE_POLL_ERROR',
        message: error.message || 'Error submitting vote',
        timestamp: new Date()
      })))
    );
  }
}
