/**
 * Response DTOs for API Mock Services
 * These interfaces define the structure of response payloads for various API operations
 */

import { User, Poll, PollOption } from './entities.interface';

// Authentication Response
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Paginated Response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Poll Results Response
export interface PollResultsResponse {
  poll: Poll;
  totalVotes: number;
  userVoted: boolean;
  userVotedOptionId?: string;
}

// QR Validation Response
export interface QRValidationResponse {
  valid: boolean;
  accessCode?: {
    code: string;
    userId: string;
    organizationId: string;
    validFrom: string;
    validUntil: string;
    usageCount: number;
    maxUsages: number;
  };
  message: string;
}

// External Pre-registration Response
export interface ExternalPreRegistrationResponse {
  registrationId: string;
  email: string;
  status: 'PENDING' | 'CONFIRMED';
  confirmationToken: string;
  expiresAt: string;
}

// External Validation Response
export interface ExternalValidationResponse {
  valid: boolean;
  userId?: string;
  organizationId?: string;
  role?: string;
  message: string;
  validationDetails?: Record<string, any>;
}

// Token Refresh Response
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Verification Response
export interface VerificationResponse {
  verified: boolean;
  userId?: string;
  email?: string;
  message: string;
}

// Visit Approval Response
export interface VisitApprovalResponse {
  visitId: string;
  status: 'APPROVED' | 'REJECTED';
  approvedBy: string;
  approvedAt: string;
  message: string;
}

// Invitation Acceptance Response
export interface InvitationAcceptanceResponse {
  invitationId: string;
  userId: string;
  organizationId: string;
  status: 'ACCEPTED';
  acceptedAt: string;
}
