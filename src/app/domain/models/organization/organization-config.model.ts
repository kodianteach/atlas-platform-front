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
  /** Organization logo encoded as Base64 string */
  logoBase64?: string;
  /** MIME type of the logo image (image/png or image/jpeg) */
  logoContentType?: string;
  /** Dominant brand color in hex format (#RRGGBB) - used for 60% surfaces */
  dominantColor?: string;
  /** Secondary brand color in hex format (#RRGGBB) - used for 30% structure */
  secondaryColor?: string;
  /** Accent brand color in hex format (#RRGGBB) - used for 10% CTAs */
  accentColor?: string;
}
