/**
 * Organization Config Gateway - Abstract interface for organization settings
 */
import { Observable } from 'rxjs';
import { OrganizationConfig } from '@domain/models/organization/organization-config.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class OrganizationConfigGateway {
  /**
   * Get organization configuration
   */
  abstract getConfig(): Observable<Result<OrganizationConfig>>;

  /**
   * Save/update organization configuration
   * @param config - Updated configuration
   */
  abstract saveConfig(config: OrganizationConfig): Observable<Result<OrganizationConfig>>;
}
