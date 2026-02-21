# Design Document: API Mock Services

## Overview

The API Mock Services system provides a comprehensive set of Angular services that simulate the Atlas Platform backend API. The design follows Angular's service architecture patterns, using RxJS Observables for asynchronous operations and TypeScript interfaces for type safety. Each of the 13 API modules (ACCESS, AUTH, COMMENT, COMPANY, EXTERNAL, INVITATION, ORGANIZATION, POLL, POST, TOWER, UNIT, VISIT, ZONE) will have a dedicated mock service that returns realistic data wrapped in the standard ApiResponse<T> structure.

The mock services are designed to be drop-in replacements for real HTTP services, enabling frontend development to proceed independently while maintaining the same interfaces and data structures that will be used in production.

## Architecture

### Service Layer Organization

```
src/app/services/mock/
├── access-mock.service.ts
├── auth-mock.service.ts
├── comment-mock.service.ts
├── company-mock.service.ts
├── external-mock.service.ts
├── invitation-mock.service.ts
├── organization-mock.service.ts
├── poll-mock.service.ts
├── post-mock.service.ts
├── tower-mock.service.ts
├── unit-mock.service.ts
├── visit-mock.service.ts
├── zone-mock.service.ts
├── types/
│   ├── api-response.interface.ts
│   ├── entities.interface.ts
│   ├── requests.interface.ts
│   └── responses.interface.ts
└── data/
    ├── mock-users.data.ts
    ├── mock-posts.data.ts
    ├── mock-companies.data.ts
    └── [other mock data files]
```

### Design Patterns

1. **Service Pattern**: Each mock service is an Angular injectable service using `@Injectable({ providedIn: 'root' })`
2. **Observable Pattern**: All methods return RxJS Observables to match async HTTP behavior
3. **Type Safety Pattern**: Strong TypeScript typing for all requests, responses, and entities
4. **Data Separation Pattern**: Mock data stored in separate data files for maintainability
5. **Response Wrapper Pattern**: All responses wrapped in ApiResponse<T> structure

### Key Architectural Decisions

- **No HTTP calls**: Mock services use `of()` operator to return static data, avoiding actual HTTP requests
- **Singleton services**: All mock services use `providedIn: 'root'` for application-wide singleton instances
- **Immutable data**: Mock data arrays are cloned before modification to prevent state pollution
- **Realistic delays**: Optional use of `delay()` operator to simulate network latency
- **Header acceptance**: Methods accept header parameters but use them minimally (primarily for documentation)

## Components and Interfaces

### Core Interfaces

#### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}
```

#### Base Entity Fields
```typescript
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
```

#### Common Enums
```typescript
enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

enum VisitStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

enum UnitStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE'
}

enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED'
}
```

### Entity Interfaces

#### User Entity
```typescript
interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId?: string;
}
```

#### Post Entity
```typescript
interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
  author?: User;
  organizationId: string;
  commentCount: number;
  likeCount: number;
}
```

#### Company Entity
```typescript
interface Company extends BaseEntity {
  name: string;
  taxId: string;
  address: string;
  status: Status;
  contactEmail: string;
  contactPhone: string;
}
```

#### Comment Entity
```typescript
interface Comment extends BaseEntity {
  postId: string;
  authorId: string;
  author?: User;
  content: string;
  parentCommentId?: string;
}
```

#### Organization Entity
```typescript
interface Organization extends BaseEntity {
  name: string;
  description: string;
  parentOrganizationId?: string;
  companyId: string;
}
```

#### Tower Entity
```typescript
interface Tower extends BaseEntity {
  name: string;
  organizationId: string;
  address: string;
  latitude: number;
  longitude: number;
  status: Status;
  unitCount: number;
}
```

#### Unit Entity
```typescript
interface Unit extends BaseEntity {
  number: string;
  towerId: string;
  floor: number;
  status: UnitStatus;
  area: number;
  occupantId?: string;
}
```

#### Visit Entity
```typescript
interface Visit extends BaseEntity {
  visitorName: string;
  visitorDocument: string;
  unitId: string;
  requestedBy: string;
  scheduledDate: string;
  status: VisitStatus;
  approvedBy?: string;
  approvedAt?: string;
}
```

#### Zone Entity
```typescript
interface Zone extends BaseEntity {
  name: string;
  organizationId: string;
  type: string;
  description: string;
  boundaries?: string; // GeoJSON or coordinate string
}
```

#### Poll Entity
```typescript
interface Poll extends BaseEntity {
  question: string;
  organizationId: string;
  createdBy: string;
  expiresAt: string;
  options: PollOption[];
}

interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}
```

#### Invitation Entity
```typescript
interface Invitation extends BaseEntity {
  email: string;
  organizationId: string;
  invitedBy: string;
  code: string;
  status: InvitationStatus;
  expiresAt: string;
}
```

#### Access Code Entity
```typescript
interface AccessCode extends BaseEntity {
  code: string;
  userId: string;
  organizationId: string;
  validFrom: string;
  validUntil: string;
  usageCount: number;
  maxUsages: number;
}
```

### Mock Service Interfaces

Each mock service follows this general structure:

```typescript
@Injectable({ providedIn: 'root' })
export class {Module}MockService {
  
  // Create operation
  create{Entity}(request: Create{Entity}Request, headers?: Headers): Observable<ApiResponse<{Entity}>> {
    // Generate new entity with ID and audit fields
    // Wrap in ApiResponse
    // Return as Observable
  }
  
  // Read operation (single)
  get{Entity}(id: string, headers?: Headers): Observable<ApiResponse<{Entity}>> {
    // Find entity by ID
    // Wrap in ApiResponse
    // Return as Observable
  }
  
  // Read operation (list)
  list{Entities}(params?: QueryParams, headers?: Headers): Observable<ApiResponse<{Entity}[]>> {
    // Return array of entities
    // Apply filtering/pagination if params provided
    // Wrap in ApiResponse
    // Return as Observable
  }
  
  // Update operation
  update{Entity}(id: string, request: Update{Entity}Request, headers?: Headers): Observable<ApiResponse<{Entity}>> {
    // Find entity by ID
    // Apply updates
    // Update updatedAt timestamp
    // Wrap in ApiResponse
    // Return as Observable
  }
  
  // Delete operation
  delete{Entity}(id: string, headers?: Headers): Observable<ApiResponse<void>> {
    // Mark entity as inactive or remove from array
    // Wrap in ApiResponse
    // Return as Observable
  }
}
```

### Helper Utilities

#### Response Builder
```typescript
function buildApiResponse<T>(
  data: T,
  path: string,
  status: number = 200,
  message: string = 'Success'
): ApiResponse<T> {
  return {
    success: true,
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
    path
  };
}
```

#### ID Generator
```typescript
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

#### Timestamp Generator
```typescript
function generateTimestamp(): string {
  return new Date().toISOString();
}
```

## Data Models

### Mock Data Storage

Mock data will be stored in separate TypeScript files within `src/app/services/mock/data/`. Each file exports a constant array of mock entities:

```typescript
// mock-users.data.ts
export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    organizationId: 'org-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  // ... more users
];
```

### Data Relationships

Mock services will maintain referential integrity where possible:
- Posts reference Users via `authorId`
- Comments reference Posts via `postId` and Users via `authorId`
- Units reference Towers via `towerId`
- Organizations can reference parent Organizations via `parentOrganizationId`
- Visits reference Units via `unitId`

### Data Mutation Strategy

Since mock services don't persist data, mutations (create, update, delete) will:
1. Clone the relevant mock data array
2. Apply the mutation to the clone
3. Return the mutated entity
4. Discard the clone (no persistence)

This approach keeps mock services stateless and predictable across test runs.

## Data Models

### Request DTOs

#### Create Post Request
```typescript
interface CreatePostRequest {
  title: string;
  content: string;
  organizationId: string;
}
```

#### Update Post Request
```typescript
interface UpdatePostRequest {
  title?: string;
  content?: string;
}
```

#### Create Comment Request
```typescript
interface CreateCommentRequest {
  postId: string;
  content: string;
  parentCommentId?: string;
}
```

#### Login Request
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

#### Register Request
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
}
```

#### Create Visit Request
```typescript
interface CreateVisitRequest {
  visitorName: string;
  visitorDocument: string;
  unitId: string;
  scheduledDate: string;
}
```

#### Vote Request
```typescript
interface VoteRequest {
  pollId: string;
  optionId: string;
}
```

### Response DTOs

#### Auth Response
```typescript
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

#### Paginated Response
```typescript
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

#### Poll Results Response
```typescript
interface PollResultsResponse {
  poll: Poll;
  totalVotes: number;
  userVoted: boolean;
  userVotedOptionId?: string;
}
```

### Query Parameters

```typescript
interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}
```

### Headers

```typescript
interface Headers {
  'X-User-Id'?: string;
  'X-Organization-Id'?: string;
  'X-Operator-Id'?: string;
  'Authorization'?: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: ApiResponse Structure Completeness

*For any* mock service method call that returns successfully, the response should be wrapped in an ApiResponse structure containing all required fields: success (true), status (valid HTTP code 200-299), message (non-empty string), data (the payload), timestamp (valid ISO 8601 format), and path (non-empty string).

**Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6**

### Property 2: Entity Creation Returns Complete Audit Fields

*For any* entity creation operation (posts, comments, companies, visits, etc.), the returned entity should contain a generated unique ID, createdAt timestamp (valid ISO 8601), updatedAt timestamp (valid ISO 8601), and isActive boolean field.

**Validates: Requirements 5.2, 6.3, 11.3, 14.3, 19.1, 19.3**

### Property 3: Timestamps Are Current and Valid

*For any* generated timestamp in mock responses, the timestamp should be in valid ISO 8601 format and should be within a reasonable time window (e.g., within 1 second) of the current time.

**Validates: Requirements 19.2**

### Property 4: Status Fields Use Valid Enum Values

*For any* entity with a status field (companies, towers, units, visits, invitations), the status value should match one of the defined enum values for that entity type (e.g., ACTIVE/INACTIVE/PENDING for general status, AVAILABLE/OCCUPIED/MAINTENANCE for units, etc.).

**Validates: Requirements 6.5, 8.4, 13.4, 14.4, 19.4**

### Property 5: List Operations Return Arrays

*For any* list/query operation (listing companies, organizations, posts, etc.), the data field in the ApiResponse should contain an array (possibly empty, but always an array type).

**Validates: Requirements 6.2, 9.2**

### Property 6: Author Information Included in Content Responses

*For any* content entity that has an author (posts, comments), the returned entity should include author information either as an embedded author object or an authorId field.

**Validates: Requirements 5.3, 11.4**

### Property 7: Delete Operations Return Success

*For any* delete operation on any entity type, the response should have success set to true and status set to 200 or 204.

**Validates: Requirements 5.5**

### Property 8: Update Operations Return Updated Entity

*For any* update operation on any entity type, the response data should contain the entity object with the updatedAt timestamp more recent than the original createdAt timestamp.

**Validates: Requirements 5.4**

### Property 9: Access Code Data Structure

*For any* access code generation or retrieval operation, the returned access code entity should contain code, userId, organizationId, validFrom, validUntil, usageCount, and maxUsages fields.

**Validates: Requirements 3.3**

### Property 10: QR Validation Response Structure

*For any* QR validation operation, the response should contain a validation result with at least a boolean validity indicator.

**Validates: Requirements 3.4**

### Property 11: Authentication Response Contains User and Tokens

*For any* authentication operation (login, register), the response data should contain a user object, accessToken string, refreshToken string, and expiresIn number.

**Validates: Requirements 4.5**

### Property 12: Invitation Data Contains Unique Codes

*For any* invitation creation operation, the returned invitation should contain a unique code field that is non-empty and distinct from other invitation codes.

**Validates: Requirements 8.3**

### Property 13: Organization Hierarchy Relationships

*For any* organization hierarchy query, organizations with a parentOrganizationId should reference valid organization IDs, maintaining referential integrity.

**Validates: Requirements 9.3**

### Property 14: Organization Metadata Presence

*For any* organization response, the organization object should contain metadata fields including name, description, and companyId.

**Validates: Requirements 9.4**

### Property 15: Poll Data Contains Options Array

*For any* poll creation or retrieval operation, the poll object should contain an options array with at least one option, where each option has id, text, and voteCount fields.

**Validates: Requirements 10.4**

### Property 16: Vote Response Updates Counts

*For any* voting operation, the response should contain updated vote count information reflecting the new vote.

**Validates: Requirements 10.5**

### Property 17: Post Listing Includes Pagination Metadata

*For any* post listing operation with pagination parameters, the response should include pagination metadata (total, page, pageSize, totalPages) in addition to the items array.

**Validates: Requirements 11.2**

### Property 18: Post Filtering and Sorting Applied

*For any* post listing operation with filter or sort parameters, the returned items should reflect the applied filters and sort order.

**Validates: Requirements 11.5**

### Property 19: Tower Data Includes Location

*For any* tower retrieval or listing operation, each tower object should contain location fields (latitude and longitude as numbers) and a status field.

**Validates: Requirements 12.2, 12.3**

### Property 20: Unit Data Includes Tower Association and Occupancy

*For any* unit retrieval or listing operation, each unit object should contain a towerId field and occupancy-related fields (status, occupantId).

**Validates: Requirements 13.2, 13.3**

### Property 21: Zone Data Includes Complete Structure

*For any* zone retrieval or listing operation, each zone object should contain boundaries, type, and name fields.

**Validates: Requirements 15.2, 15.3, 15.4**

### Property 22: Mock Methods Return Observables

*For any* mock service method invocation, the return value should be an RxJS Observable that emits exactly one value (the ApiResponse) and then completes.

**Validates: Requirements 16.2**

### Property 23: External Pre-registration Response Structure

*For any* external pre-registration operation, the response should contain confirmation data with at least a registration identifier and status.

**Validates: Requirements 7.2**

### Property 24: External Validation Response Structure

*For any* external validation operation, the response should contain validation results with at least a boolean validity indicator and validation details.

**Validates: Requirements 7.4**

### Property 25: Company Data Structure Completeness

*For any* company retrieval operation, the company object should contain all required fields: name, taxId, address, status, contactEmail, and contactPhone.

**Validates: Requirements 6.4**

## Error Handling

### Error Response Structure

Mock services will return error responses in the same ApiResponse<T> wrapper format:

```typescript
interface ErrorResponse {
  success: false;
  status: number; // 400, 404, 500, etc.
  message: string; // Error description
  data: null;
  timestamp: string;
  path: string;
}
```

### Error Scenarios

Mock services will simulate these common error scenarios:

1. **Not Found (404)**: When requesting an entity by ID that doesn't exist in mock data
2. **Bad Request (400)**: When required fields are missing from request DTOs
3. **Unauthorized (401)**: When authentication is required but not provided (optional simulation)
4. **Forbidden (403)**: When user lacks permissions for an operation (optional simulation)
5. **Conflict (409)**: When attempting to create duplicate entities (e.g., same email)

### Error Handling Pattern

```typescript
getEntity(id: string): Observable<ApiResponse<Entity>> {
  const entity = MOCK_ENTITIES.find(e => e.id === id);
  
  if (!entity) {
    return of({
      success: false,
      status: 404,
      message: `Entity with id ${id} not found`,
      data: null,
      timestamp: new Date().toISOString(),
      path: '/api/entities/' + id
    });
  }
  
  return of(buildApiResponse(entity, '/api/entities/' + id));
}
```

### Validation Errors

For create and update operations, mock services will perform basic validation:

```typescript
createEntity(request: CreateEntityRequest): Observable<ApiResponse<Entity>> {
  if (!request.requiredField) {
    return of({
      success: false,
      status: 400,
      message: 'Required field "requiredField" is missing',
      data: null,
      timestamp: new Date().toISOString(),
      path: '/api/entities'
    });
  }
  
  // Proceed with creation
}
```

## Testing Strategy

### Dual Testing Approach

The mock services will be validated using both unit tests and property-based tests:

**Unit Tests**: Focus on specific examples, edge cases, and error conditions
- Test specific mock data retrieval (e.g., get user by known ID)
- Test error scenarios (404, 400, etc.)
- Test edge cases (empty lists, null values)
- Test integration between services (e.g., posts with author data)

**Property-Based Tests**: Verify universal properties across all inputs
- Test that all responses follow ApiResponse structure (Property 1)
- Test that all created entities have audit fields (Property 2)
- Test that all timestamps are valid and current (Property 3)
- Test that all status fields use valid enums (Property 4)
- Test that all list operations return arrays (Property 5)
- And so on for all 25 properties

### Property-Based Testing Configuration

**Library**: Use `fast-check` for TypeScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: api-mock-services, Property {N}: {property text}`
- Tests organized in `*.spec.ts` files co-located with services

**Example Property Test Structure**:

```typescript
import * as fc from 'fast-check';

describe('PostMockService Properties', () => {
  
  // Feature: api-mock-services, Property 1: ApiResponse Structure Completeness
  it('should return complete ApiResponse structure for all operations', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string(),
          content: fc.string(),
          organizationId: fc.uuid()
        }),
        (createRequest) => {
          const service = new PostMockService();
          let response: ApiResponse<Post>;
          
          service.createPost(createRequest).subscribe(r => response = r);
          
          expect(response.success).toBe(true);
          expect(response.status).toBeGreaterThanOrEqual(200);
          expect(response.status).toBeLessThan(300);
          expect(response.message).toBeTruthy();
          expect(response.data).toBeDefined();
          expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
          expect(response.path).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Feature: api-mock-services, Property 2: Entity Creation Returns Complete Audit Fields
  it('should return entities with complete audit fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          content: fc.string(),
          organizationId: fc.uuid()
        }),
        (createRequest) => {
          const service = new PostMockService();
          let post: Post;
          
          service.createPost(createRequest).subscribe(r => post = r.data);
          
          expect(post.id).toBeTruthy();
          expect(post.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
          expect(post.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
          expect(typeof post.isActive).toBe('boolean');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Examples

```typescript
describe('PostMockService', () => {
  let service: PostMockService;
  
  beforeEach(() => {
    service = new PostMockService();
  });
  
  it('should return 404 when post not found', (done) => {
    service.getPost('non-existent-id').subscribe(response => {
      expect(response.success).toBe(false);
      expect(response.status).toBe(404);
      expect(response.message).toContain('not found');
      done();
    });
  });
  
  it('should return empty array when no posts exist', (done) => {
    service.listPosts().subscribe(response => {
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      done();
    });
  });
  
  it('should include author information in post response', (done) => {
    service.createPost({
      title: 'Test',
      content: 'Content',
      organizationId: 'org-1'
    }).subscribe(createResponse => {
      service.getPost(createResponse.data.id).subscribe(getResponse => {
        expect(getResponse.data.authorId).toBeDefined();
        done();
      });
    });
  });
});
```

### Test Coverage Goals

- 100% coverage of all mock service methods
- All 25 correctness properties validated with property-based tests
- Edge cases covered with unit tests
- Error scenarios covered with unit tests
- Integration scenarios (cross-service references) covered with unit tests

### Testing Execution

Tests will be run using Jasmine and Karma as configured in the Angular project:

```bash
npm test                    # Run all tests
ng test --code-coverage     # Run with coverage report
```

Property-based tests will be integrated into the standard Jasmine test suite and run alongside unit tests.
