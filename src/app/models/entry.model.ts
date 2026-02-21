/**
 * Entry Control Models for Doorman/Security Role
 */

export interface EntryRecord {
  id: string;
  visitorName: string;
  visitorType: 'resident' | 'guest' | 'service' | 'delivery' | 'unauthorized';
  unit: string;
  plate?: string;
  timestamp: Date;
  status: 'valid' | 'denied' | 'pending';
  accessType: 'qr' | 'manual' | 'walk-in';
  duration?: string;
  avatarUrl?: string;
  guestCount?: number;
  verified?: boolean;
}

export interface QRScanResult {
  valid: boolean;
  visitorName: string;
  visitorType: 'resident' | 'guest' | 'service' | 'delivery';
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
