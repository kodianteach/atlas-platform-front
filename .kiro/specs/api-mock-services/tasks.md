# Implementation Plan: API Mock Services

## Overview

This implementation plan breaks down the creation of 13 mock service modules for the Atlas Platform API. The approach follows an incremental pattern: first establishing the foundational types and utilities, then implementing each module's mock service with its specific endpoints. The plan prioritizes core infrastructure (types, response builders) before individual services, and includes property-based testing tasks to validate correctness properties throughout.

## Tasks

- [x] 1. Set up mock services infrastructure
  - Create `src/app/services/mock/` directory structure
  - Create `src/app/services/mock/types/` subdirectory for interfaces
  - Create `src/app/services/mock/data/` subdirectory for mock data
  - Install fast-check library for property-based testing: `npm install --save-dev fast-check @types/fast-check`
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Implement core type definitions
  - [x] 2.1 Create ApiResponse interface and common types
    - Create `src/app/services/mock/types/api-response.interface.ts`
    - Define ApiResponse<T> interface with success, status, message, data, timestamp, path
    - Define Headers interface for X-User-Id, X-Organization-Id, X-Operator-Id, Authorization
    - Define QueryParams interface for pagination and filtering
    - _Requirements: 2.1, 18.1, 18.2, 18.3, 18.4_
  
  - [x] 2.2 Create entity interfaces
    - Create `src/app/services/mock/types/entities.interface.ts`
    - Define BaseEntity interface with id, createdAt, updatedAt, isActive
    - Define all entity interfaces: User, Post, Comment, Company, Organization, Tower, Unit, Visit, Zone, Poll, PollOption, Invitation, AccessCode
    - Define all enum types: Status, VisitStatus, UnitStatus, InvitationStatus
    - _Requirements: 17.1, 19.3, 19.4_
  
  - [x] 2.3 Create request and response DTOs
    - Create `src/app/services/mock/types/requests.interface.ts`
    - Define all request DTOs: CreatePostRequest, UpdatePostRequest, CreateCommentRequest, LoginRequest, RegisterRequest, CreateVisitRequest, VoteRequest, etc.
    - Create `src/app/services/mock/types/responses.interface.ts`
    - Define all response DTOs: AuthResponse, PaginatedResponse, PollResultsResponse
    - _Requirements: 17.2, 17.3_

- [ ] 3. Implement utility functions
  - [x] 3.1 Create response builder utility
    - Create `src/app/services/mock/utils/response-builder.ts`
    - Implement buildApiResponse<T>() function that creates ApiResponse with all required fields
    - Implement buildErrorResponse() function for error scenarios
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [x] 3.2 Create ID and timestamp generators
    - Create `src/app/services/mock/utils/generators.ts`
    - Implement generateId() function using timestamp + random string pattern
    - Implement generateTimestamp() function returning ISO 8601 formatted current time
    - Implement generateUniqueCode() function for invitation codes
    - _Requirements: 19.1, 19.2_

- [ ] 4. Create mock data files
  - [x] 4.1 Create user mock data
    - Create `src/app/services/mock/data/mock-users.data.ts`
    - Export MOCK_USERS array with 5-10 sample users with varied roles and organizations
    - _Requirements: 19.5_
  
  - [x] 4.2 Create organization and company mock data
    - Create `src/app/services/mock/data/mock-organizations.data.ts`
    - Export MOCK_ORGANIZATIONS array with sample organizations including parent-child relationships
    - Create `src/app/services/mock/data/mock-companies.data.ts`
    - Export MOCK_COMPANIES array with sample companies with varied statuses
    - _Requirements: 19.5_
  
  - [x] 4.3 Create content mock data
    - Create `src/app/services/mock/data/mock-posts.data.ts`
    - Export MOCK_POSTS array with sample posts referencing mock users
    - Create `src/app/services/mock/data/mock-comments.data.ts`
    - Export MOCK_COMMENTS array with sample comments referencing posts and users
    - _Requirements: 19.5_
  
  - [x] 4.4 Create location mock data
    - Create `src/app/services/mock/data/mock-towers.data.ts`
    - Export MOCK_TOWERS array with sample towers including location coordinates
    - Create `src/app/services/mock/data/mock-units.data.ts`
    - Export MOCK_UNITS array with sample units referencing towers
    - Create `src/app/services/mock/data/mock-zones.data.ts`
    - Export MOCK_ZONES array with sample zones
    - _Requirements: 19.5_

- [ ] 5. Implement AUTH mock service
  - [x] 5.1 Create AuthMockService with authentication endpoints
    - Create `src/app/services/mock/auth-mock.service.ts`
    - Implement register() method returning AuthResponse with user and tokens
    - Implement login() method validating credentials and returning AuthResponse
    - Implement refreshToken() method returning new tokens
    - Implement verify() method returning verification status
    - Use @Injectable({ providedIn: 'root' })
    - All methods return Observable<ApiResponse<T>>
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 16.1, 16.2, 20.1, 20.2_
  
  - [ ]* 5.2 Write property test for AUTH responses
    - **Property 11: Authentication Response Contains User and Tokens**
    - **Validates: Requirements 4.5**

- [ ] 6. Implement POST mock service
  - [x] 6.1 Create PostMockService with CRUD operations
    - Create `src/app/services/mock/post-mock.service.ts`
    - Implement createPost() method with ID and audit field generation
    - Implement getPost() method with 404 handling
    - Implement listPosts() method with pagination support
    - Implement updatePost() method updating updatedAt timestamp
    - Implement deletePost() method returning success
    - Include author information in all post responses
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 5.1_
  
  - [ ]* 6.2 Write property tests for POST service
    - **Property 1: ApiResponse Structure Completeness**
    - **Property 2: Entity Creation Returns Complete Audit Fields**
    - **Property 6: Author Information Included in Content Responses**
    - **Property 17: Post Listing Includes Pagination Metadata**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 5.2, 11.3, 19.1, 19.3, 5.3, 11.4, 11.2**
  
  - [ ]* 6.3 Write unit tests for POST service
    - Test 404 error when post not found
    - Test empty array for empty list
    - Test filtering and sorting operations
    - _Requirements: 11.5_

- [ ] 7. Implement COMMENT mock service
  - [x] 7.1 Create CommentMockService with CRUD operations
    - Create `src/app/services/mock/comment-mock.service.ts`
    - Implement createComment() method with ID and audit fields
    - Implement getComment() method with author information
    - Implement listComments() method with postId filtering
    - Implement updateComment() method
    - Implement deleteComment() method returning success
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 7.2 Write property tests for COMMENT service
    - **Property 2: Entity Creation Returns Complete Audit Fields**
    - **Property 6: Author Information Included in Content Responses**
    - **Property 7: Delete Operations Return Success**
    - **Property 8: Update Operations Return Updated Entity**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5**

- [ ] 8. Implement COMPANY mock service
  - [x] 8.1 Create CompanyMockService with CRUD operations
    - Create `src/app/services/mock/company-mock.service.ts`
    - Implement createCompany() method with generated ID
    - Implement getCompany() method with complete company data
    - Implement listCompanies() method returning array
    - Implement updateCompany() method
    - Implement deleteCompany() method
    - Include status fields with valid enum values
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 8.2 Write property tests for COMPANY service
    - **Property 4: Status Fields Use Valid Enum Values**
    - **Property 5: List Operations Return Arrays**
    - **Property 25: Company Data Structure Completeness**
    - **Validates: Requirements 6.2, 6.4, 6.5**

- [ ] 9. Implement ORGANIZATION mock service
  - [x] 9.1 Create OrganizationMockService with CRUD operations
    - Create `src/app/services/mock/organization-mock.service.ts`
    - Implement createOrganization() method
    - Implement getOrganization() method with metadata
    - Implement listOrganizations() method returning array
    - Implement getOrganizationHierarchy() method with parent-child relationships
    - Implement updateOrganization() method
    - Implement deleteOrganization() method
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ]* 9.2 Write property tests for ORGANIZATION service
    - **Property 5: List Operations Return Arrays**
    - **Property 13: Organization Hierarchy Relationships**
    - **Property 14: Organization Metadata Presence**
    - **Validates: Requirements 9.2, 9.3, 9.4**

- [x] 10. Checkpoint - Ensure core services work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement TOWER mock service
  - [x] 11.1 Create TowerMockService with CRUD operations
    - Create `src/app/services/mock/tower-mock.service.ts`
    - Implement createTower() method
    - Implement getTower() method with location information (latitude, longitude)
    - Implement listTowers() method with status fields
    - Implement updateTower() method
    - Implement deleteTower() method
    - Support tower assignment operations
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ]* 11.2 Write property tests for TOWER service
    - **Property 19: Tower Data Includes Location**
    - **Validates: Requirements 12.2, 12.3**

- [ ] 12. Implement UNIT mock service
  - [x] 12.1 Create UnitMockService with CRUD operations
    - Create `src/app/services/mock/unit-mock.service.ts`
    - Implement createUnit() method
    - Implement getUnit() method with tower association (towerId)
    - Implement listUnits() method with occupancy information
    - Implement updateUnit() method with status management (AVAILABLE, OCCUPIED, MAINTENANCE)
    - Implement deleteUnit() method
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [ ]* 12.2 Write property tests for UNIT service
    - **Property 4: Status Fields Use Valid Enum Values**
    - **Property 20: Unit Data Includes Tower Association and Occupancy**
    - **Validates: Requirements 13.2, 13.3, 13.4**

- [ ] 13. Implement ZONE mock service
  - [x] 13.1 Create ZoneMockService with CRUD operations
    - Create `src/app/services/mock/zone-mock.service.ts`
    - Implement createZone() method
    - Implement getZone() method with boundaries, type, and access control data
    - Implement listZones() method
    - Implement updateZone() method
    - Implement deleteZone() method
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  
  - [ ]* 13.2 Write property tests for ZONE service
    - **Property 21: Zone Data Includes Complete Structure**
    - **Validates: Requirements 15.2, 15.3, 15.4**

- [ ] 14. Implement VISIT mock service
  - [x] 14.1 Create VisitMockService with visit request operations
    - Create `src/app/services/mock/visit-mock.service.ts`
    - Implement createVisit() method with unique identifiers
    - Implement getVisit() method
    - Implement listVisits() method
    - Implement approveVisit() method updating status
    - Implement rejectVisit() method updating status
    - Support visit status (PENDING, APPROVED, REJECTED, COMPLETED)
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [ ]* 14.2 Write property tests for VISIT service
    - **Property 4: Status Fields Use Valid Enum Values**
    - **Validates: Requirements 14.4**

- [ ] 15. Implement INVITATION mock service
  - [x] 15.1 Create InvitationMockService with invitation operations
    - Create `src/app/services/mock/invitation-mock.service.ts`
    - Implement createInvitation() method with unique codes
    - Implement getInvitation() method
    - Implement listInvitations() method
    - Implement acceptInvitation() method updating status
    - Implement getInvitationStatus() method returning status (PENDING, ACCEPTED, EXPIRED)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 15.2 Write property tests for INVITATION service
    - **Property 4: Status Fields Use Valid Enum Values**
    - **Property 12: Invitation Data Contains Unique Codes**
    - **Validates: Requirements 8.3, 8.4**

- [ ] 16. Implement POLL mock service
  - [x] 16.1 Create PollMockService with poll and voting operations
    - Create `src/app/services/mock/poll-mock.service.ts`
    - Implement createPoll() method with options array
    - Implement getPoll() method
    - Implement listPolls() method
    - Implement vote() method updating vote counts
    - Implement getPollResults() method with vote count information
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 16.2 Write property tests for POLL service
    - **Property 15: Poll Data Contains Options Array**
    - **Property 16: Vote Response Updates Counts**
    - **Validates: Requirements 10.4, 10.5**

- [ ] 17. Implement ACCESS mock service
  - [x] 17.1 Create AccessMockService with access code operations
    - Create `src/app/services/mock/access-mock.service.ts`
    - Implement generateAccessCode() method
    - Implement getAccessCode() method
    - Implement validateQRCode() method returning validation results
    - Implement listAccessCodes() method
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ]* 17.2 Write property tests for ACCESS service
    - **Property 9: Access Code Data Structure**
    - **Property 10: QR Validation Response Structure**
    - **Validates: Requirements 3.3, 3.4**

- [ ] 18. Implement EXTERNAL mock service
  - [x] 18.1 Create ExternalMockService with pre-registration operations
    - Create `src/app/services/mock/external-mock.service.ts`
    - Implement preRegister() method returning confirmation data
    - Implement validateExternalAdmin() method returning validation results
    - Implement getPreRegistrationStatus() method
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 18.2 Write property tests for EXTERNAL service
    - **Property 23: External Pre-registration Response Structure**
    - **Property 24: External Validation Response Structure**
    - **Validates: Requirements 7.2, 7.4**

- [x] 19. Checkpoint - Ensure all services are complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Write comprehensive property tests for common behaviors
  - [ ]* 20.1 Write cross-service property tests
    - **Property 3: Timestamps Are Current and Valid**
    - **Property 22: Mock Methods Return Observables**
    - Test these properties across multiple services to ensure consistency
    - _Requirements: 19.2, 16.2_

- [ ] 21. Create service index and documentation
  - [x] 21.1 Create barrel export file
    - Create `src/app/services/mock/index.ts`
    - Export all mock services for easy importing
    - _Requirements: 20.5_
  
  - [x] 21.2 Add JSDoc comments to all services
    - Document each service class with purpose and usage
    - Document each method with parameters and return types
    - Include examples for complex operations
    - _Requirements: 20.5_

- [x] 22. Final checkpoint - Complete validation
  - Run all tests with coverage: `ng test --code-coverage`
  - Verify all 25 correctness properties are tested
  - Ensure all 13 mock services are implemented
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Mock services use RxJS Observables to match real HTTP service patterns
- All services follow Angular 18.2 standalone architecture
- TypeScript strict mode is enabled for type safety
