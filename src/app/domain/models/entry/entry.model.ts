/**
 * Entry control models for doorman/security role
 */

export type VisitorType = 'resident' | 'guest' | 'service' | 'delivery' | 'unauthorized';
export type EntryStatus = 'valid' | 'denied' | 'pending';
export type AccessType = 'qr' | 'manual' | 'walk-in';
export type DoormanVisitorType = 'resident' | 'guest' | 'service' | 'delivery';

export interface EntryRecord {
  id: string;
  visitorName: string;
  visitorType: VisitorType;
  unit: string;
  plate?: string;
  timestamp: Date;
  status: EntryStatus;
  accessType: AccessType;
  duration?: string;
  avatarUrl?: string;
  guestCount?: number;
  verified?: boolean;
}

export interface QRScanResult {
  valid: boolean;
  visitorName: string;
  visitorType: DoormanVisitorType;
  unit: string;
  duration: string;
  plate?: string;
  guestCount?: number;
  timestamp: Date;
  avatarUrl?: string;
  badge?: string;
}

export interface GateLocation {
  name: string;
  wing: string;
  gateNumber: number;
}

// ═══════════════════════════════════════════════════════════
// HU #7: Validación en Portería — Modelos
// ═══════════════════════════════════════════════════════════

export type ValidationResult = 'VALID' | 'INVALID' | 'EXPIRED' | 'REVOKED' | 'FORMAT_ERROR';
export type SyncStatus = 'PENDING' | 'SYNCED';

export interface QrPayload {
  authId: number;
  orgId: number;
  unitCode: string;
  personName: string;
  personDoc: string;
  serviceType: string;
  validFrom: string;
  validTo: string;
  vehiclePlate?: string;
  vehicleType?: string;
  vehicleColor?: string;
  issuedAt: string;
  kid: string;
}

export interface ParsedQr {
  payload: QrPayload;
  signatureBytes: Uint8Array;
  rawPayloadBase64: string;
}

export interface AccessEvent {
  id?: number;
  authorizationId?: number;
  organizationId?: number;
  porterUserId?: number;
  deviceId?: string;
  action: 'ENTRY' | 'EXIT';
  scanResult: ValidationResult;
  personName: string;
  personDocument?: string;
  vehiclePlate?: string;
  vehicleMatch?: boolean;
  offlineValidated: boolean;
  notes?: string;
  scannedAt: string;
  syncStatus: SyncStatus;
  syncedAt?: string;
}

export interface VisitorAuthorizationSummary {
  id: number;
  personName: string;
  personDocument: string;
  serviceType: string;
  unitCode?: string;
  validFrom: string;
  validTo: string;
  vehiclePlate?: string;
  vehicleType?: string;
  vehicleColor?: string;
  status: string;
}
