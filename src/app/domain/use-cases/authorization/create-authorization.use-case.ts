/**
 * Create Authorization Use Case
 * HU #6 - Creates a new visitor authorization with optional identity document
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AuthorizationGateway } from '@domain/gateways/authorization/authorization.gateway';
import { Authorization, AuthorizationFormValue } from '@domain/models/authorization/authorization.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class CreateAuthorizationUseCase {
  private readonly authorizationGateway = inject(AuthorizationGateway);

  execute(formValue: AuthorizationFormValue, document?: File): Observable<Result<Authorization>> {
    return this.authorizationGateway.createAuthorization(formValue, document).pipe(
      catchError(error => of(failure<Authorization>({
        code: 'CREATE_AUTHORIZATION_ERROR',
        message: error.message || 'Error al crear la autorización',
        timestamp: new Date()
      })))
    );
  }
}
