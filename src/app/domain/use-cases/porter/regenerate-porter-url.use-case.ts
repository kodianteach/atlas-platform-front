/**
 * Use Case: Regenerar URL de Enrolamiento de Portero
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { PorterGateway } from '@domain/gateways/porter/porter.gateway';
import { RegenerateUrlResponse } from '@domain/models/porter/porter.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class RegeneratePorterUrlUseCase {
  private readonly porterGateway = inject(PorterGateway);

  execute(porterId: number): Observable<Result<RegenerateUrlResponse>> {
    return this.porterGateway.regenerateEnrollmentUrl(porterId).pipe(
      catchError(error => of(failure<RegenerateUrlResponse>({
        code: 'REGENERATE_URL_ERROR',
        message: error.message || 'Error al regenerar la URL de enrolamiento',
        timestamp: new Date()
      })))
    );
  }
}
