/**
 * Pre-Registration Domain Models
 * Models for the admin pre-registration flow (backoffice)
 */

/**
 * Supported document types for admin identification
 */
export enum DocumentType {
  CC = 'CC',
  CE = 'CE',
  NIT = 'NIT',
  PA = 'PA',
  TI = 'TI',
  PEP = 'PEP'
}

/**
 * Request payload for pre-registering an admin
 */
export interface PreRegisterRequest {
  fullName: string;
  email: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
}

/**
 * Response from the pre-registration endpoint
 */
export interface PreRegisterResponse {
  registered: boolean;
  email: string;
  message: string;
}
