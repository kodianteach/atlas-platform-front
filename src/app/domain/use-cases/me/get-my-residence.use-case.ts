/**
 * Get My Residence Use Case
 * Fetches the authenticated user's organization name and unit code
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { MeGateway } from '@domain/gateways/me/me.gateway';
import { MyResidence } from '@domain/models/me/my-residence.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class GetMyResidenceUseCase {
  private readonly meGateway = inject(MeGateway);

  execute(): Observable<Result<MyResidence>> {
    return this.meGateway.getMyResidence().pipe(
      catchError(() => of(failure<MyResidence>({
        code: 'GET_RESIDENCE_ERROR',
        message: 'No se pudo obtener la información de residencia',
        timestamp: new Date()
      })))
    );
  }
}
