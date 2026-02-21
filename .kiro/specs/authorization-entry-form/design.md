# Design Document: Authorization Entry Form

## Overview

The authorization entry form system is built using Angular 18's standalone component architecture with reactive forms. The design follows Atomic Design principles, organizing UI components into atoms (basic inputs), molecules (form fields with labels), organisms (complete forms), and pages (data orchestration). The system uses local storage for data persistence and RxJS for reactive state management.

The core workflow involves:
1. User triggers form display via plus (+) button
2. Form dynamically adjusts based on entry type (visitor vs courier) and vehicle status
3. Reactive validation ensures data quality before submission
4. Authorization records are persisted and displayed in chronological history view

## Architecture

### Component Hierarchy

```
AuthorizationPage (Page)
├── AuthorizationFormOrganism (Organism)
│   ├── EntryTypeSelector (Molecule)
│   ├── VisitorFieldsGroup (Molecule)
│   │   ├── TextInput (Atom)
│   │   └── FormField (Molecule)
│   ├── VehicleFieldsGroup (Molecule)
│   │   ├── CheckboxInput (Atom)
│   │   └── TextInput (Atom)
│   ├── CourierFieldsGroup (Molecule)
│   │   └── TextInput (Atom)
│   └── ValiditySelector (Molecule)
└── AuthorizationHistoryOrganism (Organism)
    └── AuthorizationListItem (Molecule)
```

### Service Layer

- **AuthorizationService**: Manages CRUD operations for authorization records
- **StorageService**: Handles local storage persistence
- **ValidationService**: Provides custom form validators

### Data Flow

1. User interactions trigger form state changes via Angular Reactive Forms
2. Form state changes propagate through RxJS observables
3. Valid submissions flow to AuthorizationService
4. Service persists data via StorageService
5. History view subscribes to authorization records observable
6. UI updates reactively when data changes

## Components and Interfaces

### Data Models

```typescript
// Core authorization record interface
interface AuthorizationRecord {
  id: string;
  firstName: string;
  lastName: string;
  idDocument: string;
  entryType: 'visitor' | 'courier';
  hasVehicle: boolean;
  licensePlate?: string;
  validityPeriod: number; // in minutes
  createdAt: Date;
  expiresAt: Date;
  orderOrigin?: string;
  orderType?: string;
}

// Form value interface
interface AuthorizationFormValue {
  firstName: string;
  lastName: string;
  idDocument: string;
  entryType: 'visitor' | 'courier';
  hasVehicle: boolean;
  licensePlate?: string;
  validityPeriod: number;
  orderOrigin?: string;
  orderType?: string;
}

// Validity period option
interface ValidityOption {
  label: string;
  minutes: number;
}
```

### Atoms

**TextInput Component**
- Props: `value`, `placeholder`, `type`, `disabled`, `error`
- Events: `valueChange`, `blur`, `focus`
- Responsibilities: Basic text input with error state styling

**CheckboxInput Component**
- Props: `checked`, `label`, `disabled`
- Events: `checkedChange`
- Responsibilities: Checkbox with associated label

**Button Component**
- Props: `label`, `type`, `disabled`, `icon`
- Events: `click`
- Responsibilities: Styled button with optional icon

**Icon Component**
- Props: `name`, `size`, `color`
- Responsibilities: Bootstrap icon wrapper

### Molecules

**FormField Component**
- Props: `label`, `required`, `error`, `hint`
- Content: Transcludes input atom
- Responsibilities: Wraps input with label, error message, and hint text

**EntryTypeSelector Component**
- Props: `selectedType`
- Events: `typeChange`
- Responsibilities: Radio button group for visitor/courier selection

**ValiditySelector Component**
- Props: `selectedPeriod`
- Events: `periodChange`
- Responsibilities: Dropdown or radio group for validity period selection
- Options: 1 hour, 2 hours, 4 hours, 8 hours, 24 hours

**AuthorizationListItem Component**
- Props: `record: AuthorizationRecord`
- Responsibilities: Display single authorization record with all relevant details

### Organisms

**AuthorizationFormOrganism Component**
- Props: `visible`
- Events: `formSubmit`, `formCancel`
- State: FormGroup with reactive validation
- Responsibilities:
  - Manage complete form state
  - Conditional field display based on entry type and vehicle status
  - Form validation and submission
  - Reset form after successful submission

**AuthorizationHistoryOrganism Component**
- Props: `visible`
- Events: `close`
- State: Observable<AuthorizationRecord[]>
- Responsibilities:
  - Fetch and display authorization records
  - Sort records chronologically (newest first)
  - Handle empty state

### Pages

**AuthorizationPage Component**
- Responsibilities:
  - Orchestrate form and history view visibility
  - Handle plus button and history icon clicks
  - Inject and use AuthorizationService
  - Manage page-level state (which view is active)
  - Display success/error notifications

### Services

**AuthorizationService**
```typescript
class AuthorizationService {
  private records$ = new BehaviorSubject<AuthorizationRecord[]>([]);
  
  createAuthorization(formValue: AuthorizationFormValue): Observable<AuthorizationRecord>
  getAllAuthorizations(): Observable<AuthorizationRecord[]>
  getAuthorizationById(id: string): Observable<AuthorizationRecord | undefined>
  deleteAuthorization(id: string): Observable<void>
}
```

**StorageService**
```typescript
class StorageService {
  setItem<T>(key: string, value: T): void
  getItem<T>(key: string): T | null
  removeItem(key: string): void
  clear(): void
}
```

## Data Models

### Authorization Record Storage

Records are stored in browser local storage under the key `authorization_records` as a JSON array. Each record includes:

- Unique identifier (UUID v4)
- All form fields (first name, last name, ID document)
- Entry type flag
- Vehicle information (conditional)
- Courier information (conditional)
- Validity period and calculated expiration timestamp
- Creation timestamp

### Form State Management

Angular Reactive Forms manages form state with:
- FormGroup for the entire form
- FormControl for each input field
- Dynamic validators based on entry type and vehicle status
- Custom validators for ID document format
- Conditional field enabling/disabling

### Validation Rules

- **First Name**: Required, min length 2, max length 50, letters only
- **Last Name**: Required, min length 2, max length 50, letters only
- **ID Document**: Required, min length 5, max length 20, alphanumeric
- **License Plate**: Required when hasVehicle=true, format validation (letters and numbers)
- **Validity Period**: Required, must be positive number
- **Order Origin**: Required when entryType='courier', min length 2
- **Order Type**: Required when entryType='courier', min length 2

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I identified several areas where properties can be consolidated:

**Consolidation Opportunities:**
1. Properties 3.2, 3.3, 3.4 (vehicle field visibility and validation) can be combined into a single comprehensive property about conditional vehicle field behavior
2. Properties 4.1, 4.2, 4.3 (courier field visibility and validation) can be combined into a single comprehensive property about conditional courier field behavior
3. Properties 2.2 and 7.1 both test validation error display for empty mandatory fields - these are redundant
4. Properties 2.3 and 7.3 both test form enablement when valid - these overlap significantly
5. Properties 3.5 and 4.4 test conditional data persistence, which is already covered by property 2.4 (complete data persistence)
6. Properties 6.3, 6.4, 6.5 test record display content and can be combined into one property about complete record rendering

**Unique Properties Retained:**
- Form submission validation (consolidated from 2.2, 7.1)
- Valid form enables submission (consolidated from 2.3, 7.3)
- Data persistence round-trip (consolidated from 2.4, 3.5, 4.4)
- Form reset after submission (2.5)
- Conditional vehicle fields (consolidated from 3.2, 3.3, 3.4)
- Conditional courier fields (consolidated from 4.1, 4.2, 4.3)
- Validity period persistence (5.2)
- Expiration calculation (5.3)
- Chronological sorting (6.2)
- Complete record display (consolidated from 6.3, 6.4, 6.5)
- Validation guidance on focus (7.2)
- Success message display (7.4)
- Immediate persistence (8.1)
- Data retrieval (8.2)
- Cross-session persistence (8.3)

### Correctness Properties

**Property 1: Empty mandatory fields prevent submission**

*For any* form state where at least one mandatory field is empty, attempting to submit the form should result in validation errors being displayed and submission being prevented.

**Validates: Requirements 2.2, 7.1**

---

**Property 2: Valid form data enables submission**

*For any* form state where all mandatory fields contain valid data (based on entry type and vehicle status), the form should be submittable and all validation errors should be cleared.

**Validates: Requirements 2.3, 7.3**

---

**Property 3: Form submission creates matching record**

*For any* valid form submission, the created Authorization_Record should contain values that exactly match the submitted form data, including all conditional fields based on entry type and vehicle status.

**Validates: Requirements 2.4, 3.5, 4.4**

---

**Property 4: Form resets after successful submission**

*For any* successful form submission, the form should be cleared to its initial empty state and ready for the next entry.

**Validates: Requirements 2.5**

---

**Property 5: Vehicle fields conditional behavior**

*For any* form state, when hasVehicle is true, the license plate field should be visible and required for validation; when hasVehicle is false, the license plate field should be hidden and excluded from validation.

**Validates: Requirements 3.2, 3.3, 3.4**

---

**Property 6: Courier fields conditional behavior**

*For any* form state, when entryType is 'courier', the order origin and order type fields should be visible and required for validation; when entryType is 'visitor', these fields should be hidden and excluded from validation.

**Validates: Requirements 4.1, 4.2, 4.3**

---

**Property 7: Validity period persistence**

*For any* authorization record creation, the validityPeriod value from the form should be stored exactly as specified in the Authorization_Record.

**Validates: Requirements 5.2**

---

**Property 8: Expiration timestamp calculation**

*For any* authorization record, the expiresAt timestamp should equal the createdAt timestamp plus the validityPeriod (converted to milliseconds).

**Validates: Requirements 5.3**

---

**Property 9: Chronological record sorting**

*For any* set of authorization records displayed in the history view, the records should be ordered by createdAt timestamp in descending order (most recent first).

**Validates: Requirements 6.2**

---

**Property 10: Complete record display**

*For any* authorization record displayed in the history view, the rendered output should include first name, last name, ID document, entry type, creation timestamp, validity period, and conditionally include license plate (if hasVehicle is true) and order origin/type (if entryType is 'courier').

**Validates: Requirements 6.3, 6.4, 6.5**

---

**Property 11: Validation guidance on field focus**

*For any* form field that is in an invalid state, when the field receives focus, validation guidance or error messages should be displayed to the user.

**Validates: Requirements 7.2**

---

**Property 12: Success message after submission**

*For any* successful form submission, a success confirmation message should be displayed to the user.

**Validates: Requirements 7.4**

---

**Property 13: Immediate record persistence**

*For any* authorization record creation, the record should be persisted to storage synchronously before the operation completes.

**Validates: Requirements 8.1**

---

**Property 14: Complete data retrieval**

*For any* history view opening, all previously stored authorization records should be retrieved and displayed.

**Validates: Requirements 8.2**

---

**Property 15: Cross-session persistence (Round-trip)**

*For any* set of authorization records created in one session, after reloading the application, all those records should still be accessible and retrievable with identical data.

**Validates: Requirements 8.3**

## Error Handling

### Form Validation Errors

- **Empty Required Fields**: Display field-specific error message below the input
- **Invalid Format**: Show format guidance (e.g., "ID document must be alphanumeric")
- **Minimum/Maximum Length**: Display character count requirements
- **Conditional Validation**: Dynamically update validation based on entry type and vehicle status

### Storage Errors

- **Local Storage Full**: Display error notification and suggest clearing old records
- **Storage Access Denied**: Fallback to in-memory storage with warning message
- **Corrupted Data**: Log error, skip corrupted records, display warning to user

### User Feedback

- **Success Messages**: Green toast notification for successful record creation
- **Error Messages**: Red toast notification for submission failures
- **Validation Feedback**: Inline error messages below form fields
- **Loading States**: Disable form during submission to prevent duplicate entries

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

**Library Selection**: Use `fast-check` for TypeScript/Angular property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `// Feature: authorization-entry-form, Property {number}: {property_text}`

**Property Test Coverage**:
- Each of the 15 correctness properties must be implemented as a single property-based test
- Tests should generate random valid and invalid form data
- Tests should verify behavior across all combinations of entry types and vehicle status
- Tests should validate data persistence and retrieval across multiple records

**Example Property Test Structure**:
```typescript
// Feature: authorization-entry-form, Property 3: Form submission creates matching record
it('should create authorization record matching form data', () => {
  fc.assert(
    fc.property(
      fc.record({
        firstName: fc.string({ minLength: 2, maxLength: 50 }),
        lastName: fc.string({ minLength: 2, maxLength: 50 }),
        idDocument: fc.string({ minLength: 5, maxLength: 20 }),
        entryType: fc.constantFrom('visitor', 'courier'),
        hasVehicle: fc.boolean(),
        validityPeriod: fc.integer({ min: 60, max: 1440 })
      }),
      (formData) => {
        const record = service.createAuthorization(formData);
        expect(record.firstName).toBe(formData.firstName);
        expect(record.lastName).toBe(formData.lastName);
        // ... verify all fields match
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Focus Areas**:
- Specific UI interactions (button clicks, icon clicks)
- Component initialization and lifecycle
- Service method behavior with known inputs
- Edge cases: empty strings, special characters, boundary values
- Error conditions: storage failures, invalid data formats
- Integration between components and services

**Unit Test Balance**:
- Avoid writing too many unit tests for scenarios covered by property tests
- Focus unit tests on concrete examples that demonstrate correct behavior
- Use unit tests for integration points between components
- Property tests handle comprehensive input coverage

**Example Unit Test Structure**:
```typescript
describe('AuthorizationFormOrganism', () => {
  it('should display form when visible input is true', () => {
    component.visible = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('form')).toBeTruthy();
  });

  it('should hide license plate field when hasVehicle is false', () => {
    component.form.patchValue({ hasVehicle: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[formControlName="licensePlate"]')).toBeFalsy();
  });
});
```

### Test Coverage Goals

- **Line Coverage**: Minimum 80%
- **Branch Coverage**: Minimum 75%
- **Property Test Coverage**: All 15 properties implemented
- **Unit Test Coverage**: All components, services, and critical paths

### Testing Workflow

1. Write property tests first to establish correctness guarantees
2. Add unit tests for specific examples and edge cases
3. Run tests on every code change
4. Verify all tests pass before considering implementation complete
5. Use code coverage reports to identify untested paths
