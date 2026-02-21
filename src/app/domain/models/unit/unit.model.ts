/**
 * Unit domain models for bulk distribution
 */

/**
 * Types of residential units
 */
export enum UnitType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE'
}

/**
 * Request payload for bulk unit distribution
 */
export interface UnitDistributeRequest {
  organizationId: number;
  rangeStart: number;
  rangeEnd: number;
  codePrefix: string;
  unitType: string;
  vehiclesEnabled: boolean;
  vehicleLimit: number;
}

/**
 * Response from bulk unit distribution
 */
export interface UnitDistributeResponse {
  unitsCreated: number;
  unitIds: number[];
  unitCodes: string[];
  rejectedCount: number;
  rejectedUnits: RejectedUnit[];
  invitationsSent: number;
  message: string;
  errors: Record<string, string>;
}

/**
 * A unit rejected during distribution (e.g., duplicate)
 */
export interface RejectedUnit {
  code: string;
  reason: string;
}

/**
 * Basic unit model
 */
export interface Unit {
  id: number;
  code: string;
  type: string;
  status: string;
}
