/**
 * Invitation Domain Models
 * Models for the owner/resident invitation and registration flow
 */

/**
 * Invitation types matching backend InvitationType enum
 */
export type InvitationType = 'OWNER' | 'RESIDENT' | 'ADMIN' | 'OWNER_SELF_REGISTER' | 'RESIDENT_INVITE';

/**
 * Invitation status matching backend InvitationStatus enum
 */
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';

/**
 * Token validation result from the backend
 */
export interface InvitationTokenValidation {
  valid: boolean;
  status: 'PENDING' | 'CONSUMED' | 'EXPIRED' | 'INVALID';
  type: InvitationType;
  organizationId: number;
  unitId?: number | string;
  unitCode?: string;
}

/**
 * Invitation record for history listing
 */
export interface Invitation {
  id: number;
  organizationId: number;
  unitId?: number;
  email?: string;
  type: InvitationType;
  status: InvitationStatus;
  invitedBy?: number;
  expiresAt?: string;
  acceptedAt?: string;
  createdAt?: string;
}

/**
 * Filter criteria for invitation history queries
 */
export interface InvitationFilters {
  type?: InvitationType;
  status?: InvitationStatus;
  unitId?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Response from creating an invitation
 */
export interface CreateInvitationResponse {
  invitationId: number;
  invitationUrl: string;
  expiresAt: string;
  token: string;
}

/**
 * Request payload for owner registration
 */
export interface OwnerRegistrationRequest {
  token: string;
  names: string;
  phone?: string;
  documentType: string;
  documentNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  unitId?: number;
}

/**
 * Request payload for resident registration
 */
export interface ResidentRegistrationRequest {
  token: string;
  names: string;
  email?: string;
  phone?: string;
  documentType: string;
  documentNumber: string;
  password: string;
  confirmPassword: string;
}

/**
 * Request payload for creating a resident invitation (by OWNER)
 */
export interface CreateResidentInvitationRequest {
  permissions?: Record<string, boolean>;
}

/**
 * User lookup result for form autocompletion
 */
export interface UserLookupResult {
  found: boolean;
  names?: string;
  email?: string;
  phone?: string;
  documentType?: string;
  documentNumber?: string;
}

/**
 * Unit search result for unit autocomplete
 */
export interface UnitSearchResult {
  id: number;
  code: string;
  type?: string;
}
