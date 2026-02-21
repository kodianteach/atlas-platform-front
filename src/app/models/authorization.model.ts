/**
 * Authorization data models for Access Permissions Management
 */

/**
 * Schedule details for scheduled access authorizations
 */
export interface ScheduleDetails {
  /** Days of the week when access is allowed (e.g., ["Mon", "Wed", "Fri"]) */
  days: string[];
  /** Time range for access (e.g., "09:00 AM - 02:00 PM") */
  timeRange: string;
}

/**
 * Type-specific details for an authorization
 */
export interface AuthorizationDetails {
  /** Access type description (e.g., "Permanent Access") */
  accessType?: string;
  /** Permissions level (e.g., "Full Permissions") */
  permissions?: string;
  /** Schedule configuration (only for scheduled type) */
  schedule?: ScheduleDetails;
}

/**
 * Main authorization model representing an access permission
 */
export interface Authorization {
  /** Unique identifier */
  id: string;
  /** Display name (e.g., "Family Member") */
  name: string;
  /** Access type: permanent or scheduled */
  type: 'permanent' | 'scheduled';
  /** Current activation status */
  isActive: boolean;
  /** Icon identifier for display */
  icon: string;
  /** Type-specific details */
  details: AuthorizationDetails;
  /** Creation timestamp */
  createdAt: Date;
  /** Last modification timestamp */
  updatedAt: Date;
}

/**
 * Type guard to check if an authorization is permanent
 */
export function isPermanentAuthorization(auth: Authorization): boolean {
  return auth.type === 'permanent';
}

/**
 * Type guard to check if an authorization is scheduled
 */
export function isScheduledAuthorization(auth: Authorization): boolean {
  return auth.type === 'scheduled';
}

/**
 * Form value for creating/editing authorizations
 * Used by authorization form component
 */
export interface AuthorizationFormValue {
  firstName: string;
  lastName: string;
  fullName?: string;
  idDocument: string;
  entryType: 'visitor' | 'courier' | 'service';
  hasVehicle: boolean;
  licensePlate?: string;
  validityPeriod: number; // in minutes
  visitDate?: string;
  visitTime?: string;
  orderOrigin?: string;
  orderType?: string;
  courierCompany?: string;
}

/**
 * Authorization record with additional metadata
 * Extended version of Authorization for list display
 */
export interface AuthorizationRecord {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  idDocument: string;
  entryType: 'visitor' | 'courier' | 'service';
  hasVehicle: boolean;
  licensePlate?: string;
  validityPeriod: number;
  visitDate?: string;
  visitTime?: string;
  createdAt: Date;
  expiresAt: Date;
  orderOrigin?: string;
  orderType?: string;
  courierCompany?: string;
}
