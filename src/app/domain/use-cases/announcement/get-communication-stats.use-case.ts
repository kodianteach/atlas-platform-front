/**
 * GetCommunicationStatsUseCase
 * Retrieves communication statistics (posts by status, polls by status) for the admin panel.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
import { CommunicationStatsResponse } from '@domain/models/announcement/announcement.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class GetCommunicationStatsUseCase {
  private readonly announcementGateway = inject(AnnouncementGateway);

  execute(): Observable<Result<CommunicationStatsResponse>> {
    return forkJoin([
      this.announcementGateway.getPostStats(),
      this.announcementGateway.getPollStats()
    ]).pipe(
      map(([postStatsResult, pollStatsResult]) => {
        if (!postStatsResult.success) {
          return failure<CommunicationStatsResponse>(postStatsResult.error);
        }
        if (!pollStatsResult.success) {
          return failure<CommunicationStatsResponse>(pollStatsResult.error);
        }

        const totalPolls = Object.values(pollStatsResult.data).reduce((sum, val) => sum + val, 0);

        return success<CommunicationStatsResponse>({
          postsByStatus: postStatsResult.data,
          pollsByStatus: pollStatsResult.data,
          totalComments: 0, // Populated by backend if needed
          participationRate: totalPolls > 0 ? (pollStatsResult.data['ACTIVE'] || 0) / totalPolls * 100 : 0
        });
      }),
      catchError(() => of(failure<CommunicationStatsResponse>({
        code: 'STATS_ERROR',
        message: 'Error al obtener estadísticas',
        timestamp: new Date()
      })))
    );
  }
}
