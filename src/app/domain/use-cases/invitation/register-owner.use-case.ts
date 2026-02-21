/**
 * Register Owner Use Case
 *
 * Orchestrates owner self-registration via invitation token.
 * Validates data and delegates to the gateway.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { InvitationGateway } from '@domain/gateways/invitation/invitation.gateway';
import { OwnerRegistrationRequest } from '@domain/models/invitation/invitation.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class RegisterOwnerUseCase {
  private readonly invitationGateway = inject(InvitationGateway);

  execute(request: OwnerRegistrationRequest): Observable<Result<void>> {
    return this.invitationGateway.registerOwner(request).pipe(
      catchError(error => of(failure<void>({
        code: 'REGISTRATION_ERROR',
        message: error.message || 'No se pudo completar el registro. Intenta de nuevo',
        timestamp: new Date()
      })))
    );
  }
}
