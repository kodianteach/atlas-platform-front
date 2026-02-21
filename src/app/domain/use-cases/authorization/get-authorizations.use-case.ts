/**
 * Get Authorizations Use Case
 * HU #6 - Lists authorizations filtered by user role on backend
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthorizationGateway } from '@domain/gateways/authorization/authorization.gateway';
import { Authorization } from '@domain/models/authorization/authorization.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class GetAuthorizationsUseCase {
  private readonly authorizationGateway = inject(AuthorizationGateway);

  execute(): Observable<Result<Authorization[]>> {
    return this.authorizationGateway.getAuthorizations().pipe(
      catchError(error => of(failure<Authorization[]>({
        code: 'GET_AUTHORIZATIONS_ERROR',
        message: error.message || 'Error al cargar las autorizaciones',
        timestamp: new Date()
      })))
    );
  }
}
