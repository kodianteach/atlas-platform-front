/**
 * Activation Domain Models
 * Models for the admin account activation flow
 */

/**
 * Token validation result from the backend
 */
export interface TokenValidationResult {
  valid: boolean;
  status: 'VALID' | 'EXPIRED' | 'CONSUMED' | 'INVALID';
  email?: string;
}

/**
 * Request payload for account activation
 */
export interface ActivateRequest {
  token: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}

/**
 * Response from the activation endpoint
 */
export interface ActivateResponse {
  activated: boolean;
  message: string;
}
