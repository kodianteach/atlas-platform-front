/**
 * Save Organization Config Use Case
 * Updates organization settings
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { OrganizationConfigGateway } from '@domain/gateways/organization/organization-config.gateway';
import { OrganizationConfig } from '@domain/models/organization/organization-config.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class SaveOrganizationConfigUseCase {
  private readonly configGateway = inject(OrganizationConfigGateway);

  execute(config: OrganizationConfig): Observable<Result<OrganizationConfig>> {
    return this.configGateway.saveConfig(config).pipe(
      catchError(error => of(failure<OrganizationConfig>({
        code: 'SAVE_CONFIG_ERROR',
        message: error.message || 'Error al guardar la configuración',
        timestamp: new Date()
      })))
    );
  }
}
