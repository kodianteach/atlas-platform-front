/**
 * Get Organization Config Use Case
 * Retrieves organization settings
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { OrganizationConfigGateway } from '@domain/gateways/organization/organization-config.gateway';
import { OrganizationConfig } from '@domain/models/organization/organization-config.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class GetOrganizationConfigUseCase {
  private readonly configGateway = inject(OrganizationConfigGateway);

  execute(): Observable<Result<OrganizationConfig>> {
    return this.configGateway.getConfig().pipe(
      catchError(error => of(failure<OrganizationConfig>({
        code: 'GET_CONFIG_ERROR',
        message: error.message || 'Error al obtener la configuración',
        timestamp: new Date()
      })))
    );
  }
}
