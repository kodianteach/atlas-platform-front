/**
 * Modelo de dominio para Portero (Gatekeeper).
 * Un portero es un usuario con rol PORTERO_GENERAL o PORTERO_DELIVERY.
 * Su id = users.id (no hay tabla separada de porteros).
 */

export type PorterType = 'PORTERO_GENERAL' | 'PORTERO_DELIVERY';

export interface Porter {
  id: number;
  organizationId: number;
  names: string;
  email: string;
  porterType: PorterType;
  status: string;
  createdAt?: string;
  enrollmentUrl?: string;
}

export interface CreatePorterRequest {
  displayName: string;
  porterType: PorterType;
}

export interface RegenerateUrlResponse {
  porterId: number;
  enrollmentUrl: string;
}
