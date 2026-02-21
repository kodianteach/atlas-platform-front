/**
 * Invitation Gateway - Abstract interface for invitation operations
 * Infrastructure adapters must implement this gateway
 */
import { Observable } from 'rxjs';
import {
  InvitationTokenValidation,
  CreateInvitationResponse,
  OwnerRegistrationRequest,
  ResidentRegistrationRequest,
  CreateResidentInvitationRequest,
  Invitation,
  InvitationFilters,
  UserLookupResult,
  UnitSearchResult
} from '@domain/models/invitation/invitation.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class InvitationGateway {
  /**
   * Create an owner invitation (ADMIN_ATLAS only)
   */
  abstract createOwnerInvitation(): Observable<Result<CreateInvitationResponse>>;

  /**
   * Create a resident invitation (OWNER only)
   * @param request - Optional permissions configuration
   */
  abstract createResidentInvitation(request?: CreateResidentInvitationRequest): Observable<Result<CreateInvitationResponse>>;

  /**
   * Validate an invitation token (external, no auth)
   * @param token - The invitation token from the URL
   */
  abstract validateInvitationToken(token: string): Observable<Result<InvitationTokenValidation>>;

  /**
   * Register an owner via invitation token (external, no auth)
   * @param request - Owner registration data
   */
  abstract registerOwner(request: OwnerRegistrationRequest): Observable<Result<void>>;

  /**
   * Register a resident via invitation token (external, no auth)
   * @param request - Resident registration data
   */
  abstract registerResident(request: ResidentRegistrationRequest): Observable<Result<void>>;

  /**
   * Get invitation history with optional filters
   * @param filters - Optional filter criteria
   */
  abstract getInvitationHistory(filters: InvitationFilters): Observable<Result<Invitation[]>>;

  /**
   * Lookup user by document type and number for form autocompletion
   */
  abstract lookupUserByDocument(documentType: string, documentNumber: string): Observable<Result<UserLookupResult>>;

  /**
   * Lookup user by email for form autocompletion
   */
  abstract lookupUserByEmail(email: string): Observable<Result<UserLookupResult>>;

  /**
   * Search units by code prefix for autocomplete
   */
  abstract searchUnits(query: string): Observable<Result<UnitSearchResult[]>>;
}
