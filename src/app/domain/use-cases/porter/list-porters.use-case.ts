/**
 * Use Case: Listar Porteros de la Organización
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { PorterGateway } from '@domain/gateways/porter/porter.gateway';
import { Porter } from '@domain/models/porter/porter.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class ListPortersUseCase {
  private readonly porterGateway = inject(PorterGateway);

  execute(): Observable<Result<Porter[]>> {
    return this.porterGateway.listPorters().pipe(
      catchError(error => of(failure<Porter[]>({
        code: 'LIST_PORTERS_ERROR',
        message: error.message || 'Error al listar los porteros',
        timestamp: new Date()
      })))
    );
  }
}
