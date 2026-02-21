/**
 * Organization configuration model
 */

/**
 * Configurable parameters for an organization
 */
export interface OrganizationConfig {
  /** Maximum number of units that can be created in a single distribution request */
  maxUnitsPerDistribution: number;
  /** When true, owners can select specific permissions for residents they invite */
  enableOwnerPermissionManagement: boolean;
}
