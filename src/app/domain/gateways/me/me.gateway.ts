import { Observable } from 'rxjs';
import { MyResidence } from '@domain/models/me/my-residence.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class MeGateway {
  /**
   * Get the authenticated user's residence info (organization + unit)
   */
  abstract getMyResidence(): Observable<Result<MyResidence>>;
}
