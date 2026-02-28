/**
 * GetAdminCommunicationsUseCase
 * Retrieves paginated posts and polls with filters for the admin communications panel.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
import {
  PostResponse,
  PollResponse,
  PostPollFilterParams
} from '@domain/models/announcement/announcement.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { PageResponse } from '@domain/models/common/pagination.model';

export interface AdminCommunicationsResult {
  posts: PageResponse<PostResponse>;
  polls: PageResponse<PollResponse>;
}

@Injectable({ providedIn: 'root' })
export class GetAdminCommunicationsUseCase {
  private readonly announcementGateway = inject(AnnouncementGateway);

  /**
   * Fetches posts and polls in parallel with the given filters.
   * If filter type is POLL-specific, only polls are fetched (and vice versa).
   */
  execute(filters: PostPollFilterParams): Observable<Result<AdminCommunicationsResult>> {
    const isPollFilter = filters.type === 'POLL';
    const isPostFilter = filters.type && filters.type !== 'POLL';

    const postsObservable = isPollFilter
      ? of(success<PageResponse<PostResponse>>({ content: [], page: 0, size: filters.size, totalElements: 0, totalPages: 0, sortBy: '', sortDirection: '', first: true, last: true }))
      : this.announcementGateway.searchPosts(filters);

    const pollsObservable = isPostFilter
      ? of(success<PageResponse<PollResponse>>({ content: [], page: 0, size: filters.size, totalElements: 0, totalPages: 0, sortBy: '', sortDirection: '', first: true, last: true }))
      : this.announcementGateway.searchPolls(filters);

    return forkJoin([postsObservable, pollsObservable]).pipe(
      map(([postsResult, pollsResult]) => {
        if (!postsResult.success) {
          return failure<AdminCommunicationsResult>(postsResult.error);
        }
        if (!pollsResult.success) {
          return failure<AdminCommunicationsResult>(pollsResult.error);
        }
        return success<AdminCommunicationsResult>({
          posts: postsResult.data,
          polls: pollsResult.data
        });
      }),
      catchError(() => of(failure<AdminCommunicationsResult>({
        code: 'FETCH_ERROR',
        message: 'Error al obtener comunicaciones',
        timestamp: new Date()
      })))
    );
  }
}
