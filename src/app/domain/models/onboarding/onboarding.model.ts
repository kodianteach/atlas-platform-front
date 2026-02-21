/**
 * Onboarding Domain Models
 * Models for the admin onboarding flow (Company + Organization creation)
 */

/**
 * Types of horizontal property organizations
 */
export enum OrganizationType {
  CIUDADELA = 'CIUDADELA',
  CONJUNTO = 'CONJUNTO',
  CONDOMINIO = 'CONDOMINIO'
}

/**
 * Request payload for completing onboarding
 */
export interface OnboardingRequest {
  organizationName: string;
  address: string;
  email?: string;
  nit: string;
  phone: string;
  organizationType: OrganizationType;
}

/**
 * Response from the onboarding endpoint
 */
export interface OnboardingResponse {
  completed: boolean;
  organizationId: string;
  message: string;
}
