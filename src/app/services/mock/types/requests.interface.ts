/**
 * Request DTOs for API Mock Services
 * These interfaces define the structure of request payloads for various API operations
 */

// Post Requests
export interface CreatePostRequest {
  title: string;
  content: string;
  organizationId: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
}

// Comment Requests
export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentRequest {
  content?: string;
}

// Authentication Requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
}

// Visit Requests
export interface CreateVisitRequest {
  visitorName: string;
  visitorDocument: string;
  unitId: string;
  scheduledDate: string;
}

export interface UpdateVisitRequest {
  scheduledDate?: string;
  status?: string;
}

// Poll and Vote Requests
export interface CreatePollRequest {
  question: string;
  organizationId: string;
  expiresAt: string;
  options: string[];
}

export interface VoteRequest {
  pollId: string;
  optionId: string;
}

// Company Requests
export interface CreateCompanyRequest {
  name: string;
  taxId: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
}

// Organization Requests
export interface CreateOrganizationRequest {
  name: string;
  description: string;
  companyId: string;
  parentOrganizationId?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  parentOrganizationId?: string;
}

// Tower Requests
export interface CreateTowerRequest {
  name: string;
  organizationId: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface UpdateTowerRequest {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
}

// Unit Requests
export interface CreateUnitRequest {
  number: string;
  towerId: string;
  floor: number;
  area: number;
}

export interface UpdateUnitRequest {
  number?: string;
  floor?: number;
  area?: number;
  status?: string;
  occupantId?: string;
}

// Zone Requests
export interface CreateZoneRequest {
  name: string;
  organizationId: string;
  type: string;
  description: string;
  boundaries?: string;
}

export interface UpdateZoneRequest {
  name?: string;
  type?: string;
  description?: string;
  boundaries?: string;
}

// Invitation Requests
export interface CreateInvitationRequest {
  email: string;
  organizationId: string;
  expiresAt: string;
}

// Access Code Requests
export interface CreateAccessCodeRequest {
  userId: string;
  organizationId: string;
  validFrom: string;
  validUntil: string;
  maxUsages: number;
}

export interface ValidateQRRequest {
  code: string;
  organizationId: string;
}

// External Pre-registration Requests
export interface ExternalPreRegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  role: string;
}

export interface ExternalValidationRequest {
  token: string;
  organizationId: string;
}

// Query Parameters
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

// Headers
export interface Headers {
  'X-User-Id'?: string;
  'X-Organization-Id'?: string;
  'X-Operator-Id'?: string;
  'Authorization'?: string;
}
