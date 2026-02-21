/**
 * Create Resident Invitation Use Case
 *
 * Creates a resident invitation link (OWNER only).
 * Optionally includes permission configuration.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { InvitationGateway } from '@domain/gateways/invitation/invitation.gateway';
import { CreateInvitationResponse, CreateResidentInvitationRequest } from '@domain/models/invitation/invitation.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class CreateResidentInvitationUseCase {
  private readonly invitationGateway = inject(InvitationGateway);

  execute(request?: CreateResidentInvitationRequest): Observable<Result<CreateInvitationResponse>> {
    return this.invitationGateway.createResidentInvitation(request).pipe(
      catchError(error => of(failure<CreateInvitationResponse>({
        code: 'INVITATION_ERROR',
        message: error.message || 'No se pudo generar la invitación. Intenta de nuevo',
        timestamp: new Date()
      })))
    );
  }
}
