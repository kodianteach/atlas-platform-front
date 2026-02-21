/**
 * Announcement Gateway - Abstract interface for announcements
 */
import { Observable } from 'rxjs';
import { Announcement } from '@domain/models/announcement/announcement.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class AnnouncementGateway {
  /**
   * Get all announcements
   */
  abstract getAnnouncements(): Observable<Result<Announcement[]>>;

  /**
   * Get a single announcement by ID
   * @param id - Announcement ID
   */
  abstract getAnnouncementById(id: string): Observable<Result<Announcement>>;

  /**
   * Vote on a poll
   * @param pollId - Poll ID
   * @param optionId - Selected option ID
   */
  abstract votePoll(pollId: string, optionId: string): Observable<Result<void>>;
}
