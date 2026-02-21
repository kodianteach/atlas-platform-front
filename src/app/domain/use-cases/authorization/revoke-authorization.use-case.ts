/**
 * Revoke Authorization Use Case
 * HU #6 - Revokes an active visitor authorization
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthorizationGateway } from '@domain/gateways/authorization/authorization.gateway';
import { Authorization } from '@domain/models/authorization/authorization.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class RevokeAuthorizationUseCase {
  private readonly authorizationGateway = inject(AuthorizationGateway);

  execute(id: number): Observable<Result<Authorization>> {
    return this.authorizationGateway.revokeAuthorization(id).pipe(
      catchError(error => of(failure<Authorization>({
        code: 'REVOKE_AUTHORIZATION_ERROR',
        message: error.message || 'Error al revocar la autorización',
        timestamp: new Date()
      })))
    );
  }
}
