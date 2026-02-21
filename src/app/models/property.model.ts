export interface Property {
  id: string;
  name: string;
  taxId: string;
  totalUnits: number;
  propertyType: PropertyType;
  adminId: string;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 'conjunto' | 'ciudadela' | 'condominio';

export enum PropertyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export interface PropertyRegistrationData {
  condominiumName: string;
  taxId: string;
  totalUnits: number;
  propertyType: PropertyType;
}

export interface PropertyRegistrationRequest {
  name: string;
  taxId: string;
  totalUnits: number;
  propertyType: PropertyType;
}

export interface PropertyRegistrationResponse {
  success: boolean;
  property?: Property;
  error?: string;
}
