/**
 * Vote Poll Use Case
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class VotePollUseCase {
  private readonly announcementGateway = inject(AnnouncementGateway);

  execute(pollId: string, optionId: string): Observable<Result<void>> {
    return this.announcementGateway.votePoll(pollId, optionId).pipe(
      catchError(error => of(failure<void>({
        code: 'VOTE_POLL_ERROR',
        message: error.message || 'Error submitting vote',
        timestamp: new Date()
      })))
    );
  }
}
