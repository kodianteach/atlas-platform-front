# Requirements Document

## Introduction

The Atlas Platform requires mock services to simulate backend API behavior during development. These mock services will provide realistic data responses for 13 API modules covering 82 endpoints, allowing frontend development to proceed independently of backend implementation. The mock services will follow the same patterns as the real API, including standard response wrappers, authentication headers, and CRUD operations.

## Glossary

- **Mock_Service**: A service class that simulates backend API behavior by returning predefined data
- **API_Module**: A logical grouping of related endpoints (e.g., AUTH, POST, COMPANY)
- **ApiResponse**: The standard response wrapper containing success, status, message, data, timestamp, and path fields
- **Observable**: RxJS Observable type used for asynchronous operations
- **Endpoint**: A specific API route that handles a particular operation
- **CRUD**: Create, Read, Update, Delete operations
- **Audit_Fields**: Standard fields present on entities (createdAt, updatedAt, isActive)

## Requirements

### Requirement 1: Mock Service Organization

**User Story:** As a developer, I want mock services organized by API module, so that I can easily locate and maintain mock implementations for specific functionality.

#### Acceptance Criteria

1. THE System SHALL create one mock service class per API module
2. THE System SHALL place all mock services in the src/app/services/mock/ directory
3. WHEN a mock service is created, THE System SHALL name it using the pattern {module-name}-mock.service.ts
4. THE System SHALL use Angular's @Injectable decorator with providedIn: 'root' for all mock services

### Requirement 2: Standard Response Structure

**User Story:** As a developer, I want all mock responses to follow the ApiResponse<T> wrapper pattern, so that mock data matches the real API structure.

#### Acceptance Criteria

1. THE System SHALL define an ApiResponse<T> interface with success, status, message, data, timestamp, and path fields
2. WHEN any mock endpoint returns data, THE System SHALL wrap it in an ApiResponse<T> structure
3. THE System SHALL set success to true for successful operations
4. THE System SHALL set status to appropriate HTTP status codes (200, 201, 204, etc.)
5. THE System SHALL generate ISO 8601 formatted timestamps for each response
6. THE System SHALL populate the path field with the simulated endpoint path

### Requirement 3: ACCESS Module Mock Service

**User Story:** As a developer, I want mock implementations for ACCESS module endpoints, so that I can develop access code and QR validation features.

#### Acceptance Criteria

1. THE Access_Mock_Service SHALL implement endpoints for access code generation
2. THE Access_Mock_Service SHALL implement endpoints for QR code validation
3. WHEN access code endpoints are called, THE Access_Mock_Service SHALL return realistic access code data
4. WHEN QR validation endpoints are called, THE Access_Mock_Service SHALL return validation results

### Requirement 4: AUTH Module Mock Service

**User Story:** As a developer, I want mock implementations for AUTH module endpoints, so that I can develop authentication flows without a backend.

#### Acceptance Criteria

1. THE Auth_Mock_Service SHALL implement register endpoint returning user registration data
2. THE Auth_Mock_Service SHALL implement login endpoint returning authentication tokens
3. THE Auth_Mock_Service SHALL implement refresh token endpoint returning new tokens
4. THE Auth_Mock_Service SHALL implement verify endpoint returning verification status
5. WHEN authentication endpoints are called, THE Auth_Mock_Service SHALL return realistic user and token data

### Requirement 5: COMMENT Module Mock Service

**User Story:** As a developer, I want mock implementations for COMMENT module endpoints, so that I can develop comment functionality on posts.

#### Acceptance Criteria

1. THE Comment_Mock_Service SHALL implement CRUD operations for comments
2. WHEN comment creation is requested, THE Comment_Mock_Service SHALL return a new comment with generated ID and audit fields
3. WHEN comment retrieval is requested, THE Comment_Mock_Service SHALL return comment data with author information
4. WHEN comment update is requested, THE Comment_Mock_Service SHALL return updated comment data
5. WHEN comment deletion is requested, THE Comment_Mock_Service SHALL return success confirmation

### Requirement 6: COMPANY Module Mock Service

**User Story:** As a developer, I want mock implementations for COMPANY module endpoints, so that I can develop company management features.

#### Acceptance Criteria

1. THE Company_Mock_Service SHALL implement CRUD operations for companies
2. WHEN company listing is requested, THE Company_Mock_Service SHALL return an array of company data
3. WHEN company creation is requested, THE Company_Mock_Service SHALL return new company data with generated ID
4. WHEN company retrieval is requested, THE Company_Mock_Service SHALL return detailed company information
5. THE Company_Mock_Service SHALL include status fields (ACTIVE, INACTIVE) in company data

### Requirement 7: EXTERNAL Module Mock Service

**User Story:** As a developer, I want mock implementations for EXTERNAL module endpoints, so that I can develop external admin pre-registration flows.

#### Acceptance Criteria

1. THE External_Mock_Service SHALL implement pre-registration endpoints
2. WHEN pre-registration is requested, THE External_Mock_Service SHALL return registration confirmation data
3. THE External_Mock_Service SHALL handle external admin validation endpoints
4. WHEN validation is requested, THE External_Mock_Service SHALL return validation results

### Requirement 8: INVITATION Module Mock Service

**User Story:** As a developer, I want mock implementations for INVITATION module endpoints, so that I can develop user invitation features.

#### Acceptance Criteria

1. THE Invitation_Mock_Service SHALL implement invitation creation endpoints
2. THE Invitation_Mock_Service SHALL implement invitation acceptance endpoints
3. WHEN invitation creation is requested, THE Invitation_Mock_Service SHALL return invitation data with unique codes
4. WHEN invitation status is requested, THE Invitation_Mock_Service SHALL return current invitation state (PENDING, ACCEPTED, EXPIRED)

### Requirement 9: ORGANIZATION Module Mock Service

**User Story:** As a developer, I want mock implementations for ORGANIZATION module endpoints, so that I can develop organization management features.

#### Acceptance Criteria

1. THE Organization_Mock_Service SHALL implement CRUD operations for organizations
2. WHEN organization listing is requested, THE Organization_Mock_Service SHALL return an array of organization data
3. WHEN organization hierarchy is requested, THE Organization_Mock_Service SHALL return parent-child relationships
4. THE Organization_Mock_Service SHALL include organizational metadata in responses

### Requirement 10: POLL Module Mock Service

**User Story:** As a developer, I want mock implementations for POLL module endpoints, so that I can develop polling and voting features.

#### Acceptance Criteria

1. THE Poll_Mock_Service SHALL implement poll creation endpoints
2. THE Poll_Mock_Service SHALL implement voting endpoints
3. THE Poll_Mock_Service SHALL implement poll results endpoints
4. WHEN poll creation is requested, THE Poll_Mock_Service SHALL return poll data with options
5. WHEN voting is requested, THE Poll_Mock_Service SHALL return updated vote counts

### Requirement 11: POST Module Mock Service

**User Story:** As a developer, I want mock implementations for POST module endpoints, so that I can develop publication and post features.

#### Acceptance Criteria

1. THE Post_Mock_Service SHALL implement CRUD operations for posts
2. WHEN post listing is requested, THE Post_Mock_Service SHALL return paginated post data
3. WHEN post creation is requested, THE Post_Mock_Service SHALL return new post with generated ID and timestamps
4. THE Post_Mock_Service SHALL include author information in post responses
5. THE Post_Mock_Service SHALL support post filtering and sorting operations

### Requirement 12: TOWER Module Mock Service

**User Story:** As a developer, I want mock implementations for TOWER module endpoints, so that I can develop tower management features.

#### Acceptance Criteria

1. THE Tower_Mock_Service SHALL implement CRUD operations for towers
2. WHEN tower listing is requested, THE Tower_Mock_Service SHALL return tower data with location information
3. THE Tower_Mock_Service SHALL include tower status fields in responses
4. THE Tower_Mock_Service SHALL support tower assignment operations

### Requirement 13: UNIT Module Mock Service

**User Story:** As a developer, I want mock implementations for UNIT module endpoints, so that I can develop unit management features.

#### Acceptance Criteria

1. THE Unit_Mock_Service SHALL implement CRUD operations for units
2. WHEN unit listing is requested, THE Unit_Mock_Service SHALL return unit data with tower associations
3. THE Unit_Mock_Service SHALL include unit occupancy information
4. THE Unit_Mock_Service SHALL support unit status management (AVAILABLE, OCCUPIED, MAINTENANCE)

### Requirement 14: VISIT Module Mock Service

**User Story:** As a developer, I want mock implementations for VISIT module endpoints, so that I can develop visit request features.

#### Acceptance Criteria

1. THE Visit_Mock_Service SHALL implement visit request creation endpoints
2. THE Visit_Mock_Service SHALL implement visit approval endpoints
3. WHEN visit request is created, THE Visit_Mock_Service SHALL return visit data with unique identifiers
4. WHEN visit status is requested, THE Visit_Mock_Service SHALL return current visit state (PENDING, APPROVED, REJECTED, COMPLETED)

### Requirement 15: ZONE Module Mock Service

**User Story:** As a developer, I want mock implementations for ZONE module endpoints, so that I can develop zone management features.

#### Acceptance Criteria

1. THE Zone_Mock_Service SHALL implement CRUD operations for zones
2. WHEN zone listing is requested, THE Zone_Mock_Service SHALL return zone data with boundaries
3. THE Zone_Mock_Service SHALL include zone type information in responses
4. THE Zone_Mock_Service SHALL support zone access control data

### Requirement 16: Observable-Based Async Operations

**User Story:** As a developer, I want all mock services to return Observables, so that they match the async patterns of real HTTP services.

#### Acceptance Criteria

1. THE System SHALL use RxJS Observable as the return type for all mock service methods
2. WHEN a mock service method is called, THE System SHALL return an Observable that emits the mock data
3. THE System SHALL use the of() operator to create Observables from static mock data
4. THE System SHALL support delayed responses using delay() operator where realistic timing is needed

### Requirement 17: TypeScript Type Safety

**User Story:** As a developer, I want proper TypeScript interfaces for all request and response types, so that I have compile-time type checking.

#### Acceptance Criteria

1. THE System SHALL define TypeScript interfaces for all entity types (User, Post, Company, etc.)
2. THE System SHALL define TypeScript interfaces for all request DTOs
3. THE System SHALL define TypeScript interfaces for all response DTOs
4. WHEN mock services are implemented, THE System SHALL use these interfaces for type annotations
5. THE System SHALL enable strict TypeScript checking for all mock service code

### Requirement 18: Request Header Simulation

**User Story:** As a developer, I want mock services to accept standard headers, so that I can test header-dependent functionality.

#### Acceptance Criteria

1. THE System SHALL accept X-User-Id header in mock service methods where applicable
2. THE System SHALL accept X-Organization-Id header in mock service methods where applicable
3. THE System SHALL accept X-Operator-Id header in mock service methods where applicable
4. THE System SHALL accept Authorization header in mock service methods where applicable
5. WHEN headers are provided, THE System SHALL use them to customize mock responses where relevant

### Requirement 19: Realistic Mock Data Generation

**User Story:** As a developer, I want mock services to return realistic data, so that I can properly test UI components and user flows.

#### Acceptance Criteria

1. THE System SHALL generate realistic IDs using UUID or incremental patterns
2. THE System SHALL generate realistic timestamps using current date/time
3. THE System SHALL include all required audit fields (createdAt, updatedAt, isActive) in entity responses
4. THE System SHALL use realistic enum values for status fields (ACTIVE, INACTIVE, PENDING, etc.)
5. THE System SHALL generate varied mock data to simulate different scenarios

### Requirement 20: Angular Service Integration

**User Story:** As a developer, I want mock services to integrate seamlessly with Angular's dependency injection, so that I can easily swap between mock and real services.

#### Acceptance Criteria

1. THE System SHALL use Angular's @Injectable decorator for all mock services
2. THE System SHALL configure providedIn: 'root' for singleton behavior
3. THE System SHALL follow Angular service naming conventions ({name}-mock.service.ts)
4. THE System SHALL include proper imports for Angular core and RxJS dependencies
5. THE System SHALL be compatible with Angular 18.2 standalone component architecture
