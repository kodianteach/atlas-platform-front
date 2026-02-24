/**
 * Use Case: Activar/Inactivar Portero
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { PorterGateway } from '@domain/gateways/porter/porter.gateway';
import { ToggleStatusResponse } from '@domain/models/porter/porter.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class TogglePorterStatusUseCase {
  private readonly porterGateway = inject(PorterGateway);

  execute(porterId: number): Observable<Result<ToggleStatusResponse>> {
    return this.porterGateway.togglePorterStatus(porterId).pipe(
      catchError(error => of(failure<ToggleStatusResponse>({
        code: 'TOGGLE_STATUS_ERROR',
        message: error.message || 'Error al cambiar estado del portero',
        timestamp: new Date()
      })))
    );
  }
}
