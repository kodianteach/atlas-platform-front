/**
 * Get Authorization By Id Use Case
 * HU #6 - Retrieves a single authorization with access validation
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthorizationGateway } from '@domain/gateways/authorization/authorization.gateway';
import { Authorization } from '@domain/models/authorization/authorization.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class GetAuthorizationByIdUseCase {
  private readonly authorizationGateway = inject(AuthorizationGateway);

  execute(id: number): Observable<Result<Authorization>> {
    return this.authorizationGateway.getAuthorizationById(id).pipe(
      catchError(error => of(failure<Authorization>({
        code: 'GET_AUTHORIZATION_ERROR',
        message: error.message || 'Error al consultar la autorización',
        timestamp: new Date()
      })))
    );
  }
}
