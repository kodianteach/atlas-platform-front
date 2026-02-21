/**
 * Mock Services Barrel Export
 * 
 * Provides centralized exports for all mock services, types, and utilities.
 * Import from this file to access any mock service functionality.
 * 
 * @example
 * ```typescript
 * import { AuthMockService, PostMockService, ApiResponse } from '@services/mock';
 * ```
 */

// Mock Services
export { AuthMockService } from './auth-mock.service';
export { PostMockService } from './post-mock.service';
export { CommentMockService } from './comment-mock.service';
export { CompanyMockService } from './company-mock.service';
export { OrganizationMockService } from './organization-mock.service';
export { TowerMockService } from './tower-mock.service';
export { UnitMockService } from './unit-mock.service';
export { ZoneMockService } from './zone-mock.service';
export { VisitMockService } from './visit-mock.service';
export { InvitationMockService } from './invitation-mock.service';
export { PollMockService } from './poll-mock.service';
export { AccessMockService } from './access-mock.service';
export { ExternalMockService } from './external-mock.service';

// Types and Interfaces
export * from './types/api-response.interface';
export * from './types/entities.interface';
export * from './types/requests.interface';
export * from './types/responses.interface';

// Utilities
export { buildApiResponse, buildErrorResponse } from './utils/response-builder';
export { generateId, generateTimestamp, generateUniqueCode } from './utils/generators';

// Mock Data (optional - export if needed for testing)
export { MOCK_USERS } from './data/mock-users.data';
export { MOCK_POSTS } from './data/mock-posts.data';
export { MOCK_COMMENTS } from './data/mock-comments.data';
export { MOCK_COMPANIES } from './data/mock-companies.data';
export { MOCK_ORGANIZATIONS } from './data/mock-organizations.data';
export { MOCK_TOWERS } from './data/mock-towers.data';
export { MOCK_UNITS } from './data/mock-units.data';
export { MOCK_ZONES } from './data/mock-zones.data';
export { MOCK_VISITS } from './data/mock-visits.data';
export { MOCK_INVITATIONS } from './data/mock-invitations.data';
export { MOCK_POLLS } from './data/mock-polls.data';
export { MOCK_ACCESS_CODES } from './data/mock-access-codes.data';
