/**
 * Search Units Use Case
 *
 * Searches units by code prefix for autocomplete in registration forms.
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { InvitationGateway } from '@domain/gateways/invitation/invitation.gateway';
import { UnitSearchResult } from '@domain/models/invitation/invitation.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class SearchUnitsUseCase {
  private readonly invitationGateway = inject(InvitationGateway);

  execute(query: string): Observable<Result<UnitSearchResult[]>> {
    return this.invitationGateway.searchUnits(query).pipe(
      catchError(() => of(success<UnitSearchResult[]>([])))
    );
  }
}
