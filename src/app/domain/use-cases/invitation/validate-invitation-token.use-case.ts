/**
 * Validate Invitation Token Use Case
 *
 * Validates an invitation token (owner or resident) to determine
 * if the registration form should be shown or an error displayed.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { InvitationGateway } from '@domain/gateways/invitation/invitation.gateway';
import { InvitationTokenValidation } from '@domain/models/invitation/invitation.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class ValidateInvitationTokenUseCase {
  private readonly invitationGateway = inject(InvitationGateway);

  execute(token: string): Observable<Result<InvitationTokenValidation>> {
    return this.invitationGateway.validateInvitationToken(token).pipe(
      catchError(error => of(failure<InvitationTokenValidation>({
        code: 'TOKEN_VALIDATION_ERROR',
        message: error.message || 'No se pudo validar el token. Intenta de nuevo',
        timestamp: new Date()
      })))
    );
  }
}
