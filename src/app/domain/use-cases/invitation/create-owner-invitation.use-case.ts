/**
 * Create Owner Invitation Use Case
 *
 * Creates an owner invitation link (ADMIN_ATLAS only).
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { InvitationGateway } from '@domain/gateways/invitation/invitation.gateway';
import { CreateInvitationResponse } from '@domain/models/invitation/invitation.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class CreateOwnerInvitationUseCase {
  private readonly invitationGateway = inject(InvitationGateway);

  execute(): Observable<Result<CreateInvitationResponse>> {
    return this.invitationGateway.createOwnerInvitation().pipe(
      catchError(error => of(failure<CreateInvitationResponse>({
        code: 'INVITATION_ERROR',
        message: error.message || 'No se pudo generar la invitación. Intenta de nuevo',
        timestamp: new Date()
      })))
    );
  }
}
