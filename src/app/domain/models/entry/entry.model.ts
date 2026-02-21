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
