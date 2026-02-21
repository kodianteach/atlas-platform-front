import { Observable } from 'rxjs';
import { Porter, CreatePorterRequest, RegenerateUrlResponse } from '@domain/models/porter/porter.model';
import { Result } from '@domain/models/common/api-response.model';

/**
 * Gateway abstracto para operaciones de portero.
 */
export abstract class PorterGateway {
  abstract createPorter(request: CreatePorterRequest): Observable<Result<Porter>>;
  abstract listPorters(): Observable<Result<Porter[]>>;
  abstract regenerateEnrollmentUrl(porterId: number): Observable<Result<RegenerateUrlResponse>>;
}
