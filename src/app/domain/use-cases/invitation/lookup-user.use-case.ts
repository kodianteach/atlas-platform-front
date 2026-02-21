/**
 * Lookup User Use Case
 *
 * Looks up existing users by document or email for form autocompletion.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { InvitationGateway } from '@domain/gateways/invitation/invitation.gateway';
import { UserLookupResult } from '@domain/models/invitation/invitation.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class LookupUserUseCase {
  private readonly invitationGateway = inject(InvitationGateway);

  executeByDocument(documentType: string, documentNumber: string): Observable<Result<UserLookupResult>> {
    return this.invitationGateway.lookupUserByDocument(documentType, documentNumber).pipe(
      catchError(() => of(success<UserLookupResult>({ found: false })))
    );
  }

  executeByEmail(email: string): Observable<Result<UserLookupResult>> {
    return this.invitationGateway.lookupUserByEmail(email).pipe(
      catchError(() => of(success<UserLookupResult>({ found: false })))
    );
  }
}
