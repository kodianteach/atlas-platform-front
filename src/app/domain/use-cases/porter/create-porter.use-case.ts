/**
 * Use Case: Crear Portero
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { PorterGateway } from '@domain/gateways/porter/porter.gateway';
import { CreatePorterRequest, Porter } from '@domain/models/porter/porter.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class CreatePorterUseCase {
  private readonly porterGateway = inject(PorterGateway);

  execute(request: CreatePorterRequest): Observable<Result<Porter>> {
    return this.porterGateway.createPorter(request).pipe(
      catchError(error => of(failure<Porter>({
        code: 'CREATE_PORTER_ERROR',
        message: error.message || 'Error al crear el portero',
        timestamp: new Date()
      })))
    );
  }
}
