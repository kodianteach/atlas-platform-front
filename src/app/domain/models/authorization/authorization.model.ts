/**
 * Authorization data models for Visitor Access Authorization with Signed QR
 * HU #6 - Generación de Autorizaciones con QR Firmado
 */

/**
 * Service type for the authorized visit
 */
export type ServiceType = 'DELIVERY' | 'VISIT' | 'TECHNICIAN' | 'OTHER';

/**
 * Status of an authorization
 */
export type AuthorizationStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

/**
 * Main authorization model representing a visitor access authorization
 */
export interface Authorization {
  id: number;
  organizationId: number;
  unitId: number;
  createdByUserId: number;
  personName: string;
  personDocument: string;
  serviceType: ServiceType;
  validFrom: string;
  validTo: string;
  vehiclePlate?: string;
  vehicleType?: string;
  vehicleColor?: string;
  identityDocumentKey?: string;
  signedQr?: string;
  status: AuthorizationStatus;
  revokedAt?: string;
  revokedBy?: number;
  createdAt: string;
  updatedAt: string;
  unitCode?: string;
  createdByUserName?: string;
}

/**
 * Form value for creating a new authorization
 */
export interface AuthorizationFormValue {
  personName: string;
  personDocument: string;
  serviceType: ServiceType;
  validFrom: string;
  validTo: string;
  unitId: number;
  vehiclePlate?: string;
  vehicleType?: string;
  vehicleColor?: string;
}

/**
 * Data returned from QR verification (external/public endpoint)
 */
export interface AuthorizationVerification {
  id: number;
  personName: string;
  personDocument: string;
  serviceType: ServiceType;
  status: AuthorizationStatus;
  validFrom: string;
  validTo: string;
  vehiclePlate?: string;
  vehicleType?: string;
  vehicleColor?: string;
  isCurrentlyValid: boolean;
  invalidReason?: 'REVOKED' | 'EXPIRED' | 'NOT_YET_VALID';
}

/**
 * Checks if an authorization is currently valid
 */
export function isAuthorizationValid(auth: Authorization): boolean {
  if (auth.status !== 'ACTIVE') return false;
  const now = new Date().toISOString();
  return now >= auth.validFrom && now <= auth.validTo;
}

/**
 * Service type display labels
 */
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  DELIVERY: 'Delivery',
  VISIT: 'Visita',
  TECHNICIAN: 'Técnico',
  OTHER: 'Otro'
};

/**
 * Status display labels
 */
export const STATUS_LABELS: Record<AuthorizationStatus, string> = {
  ACTIVE: 'Activa',
  REVOKED: 'Revocada',
  EXPIRED: 'Expirada'
};
