# Implementation Plan: Authorization Entry Form

## Overview

This implementation plan breaks down the authorization entry form feature into incremental coding tasks. The approach follows Atomic Design principles, building from atoms (basic inputs) to molecules (form fields), organisms (complete forms), and pages (data orchestration). Each task builds on previous work, with property-based tests placed close to implementation to catch errors early.

## Tasks

- [x] 1. Set up project structure and core interfaces
  - Create Atomic Design directory structure: `src/app/ui/atoms/`, `src/app/ui/molecules/`, `src/app/ui/organisms/`, `src/app/pages/`
  - Create `src/app/services/` directory for business logic
  - Create `src/app/models/` directory for TypeScript interfaces
  - Define `AuthorizationRecord` and `AuthorizationFormValue` interfaces in `src/app/models/authorization.model.ts`
  - Define `ValidityOption` interface in `src/app/models/authorization.model.ts`
  - _Requirements: All requirements (foundational)_

- [x] 2. Implement storage service
  - [x] 2.1 Create StorageService in `src/app/services/storage.service.ts`
    - Implement `setItem<T>(key: string, value: T): void` method
    - Implement `getItem<T>(key: string): T | null` method
    - Implement `removeItem(key: string): void` method
    - Implement `clear(): void` method
    - Add error handling for storage quota exceeded and access denied
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ]* 2.2 Write property test for StorageService
    - **Property 15: Cross-session persistence (Round-trip)**
    - **Validates: Requirements 8.3**
    - Generate random authorization records, store them, retrieve them, verify data matches
  
  - [ ]* 2.3 Write unit tests for StorageService
    - Test storage quota exceeded error handling
    - Test storage access denied error handling
    - Test null return for non-existent keys
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 3. Implement authorization service
  - [x] 3.1 Create AuthorizationService in `src/app/services/authorization.service.ts`
    - Implement `BehaviorSubject<AuthorizationRecord[]>` for reactive state
    - Implement `createAuthorization(formValue: AuthorizationFormValue): Observable<AuthorizationRecord>` method
    - Generate unique IDs using UUID v4
    - Calculate `expiresAt` timestamp based on `createdAt` and `validityPeriod`
    - Implement `getAllAuthorizations(): Observable<AuthorizationRecord[]>` method
    - Implement `getAuthorizationById(id: string): Observable<AuthorizationRecord | undefined>` method
    - Load existing records from StorageService on initialization
    - Persist records to StorageService on creation
    - _Requirements: 2.4, 5.2, 5.3, 8.1, 8.2_
  
  - [ ]* 3.2 Write property test for authorization creation
    - **Property 3: Form submission creates matching record**
    - **Validates: Requirements 2.4, 3.5, 4.4**
    - Generate random form data with various entry types and vehicle statuses, verify created records match exactly
  
  - [ ]* 3.3 Write property test for expiration calculation
    - **Property 8: Expiration timestamp calculation**
    - **Validates: Requirements 5.3**
    - Generate random validity periods, verify expiresAt = createdAt + validityPeriod
  
  - [ ]* 3.4 Write property test for immediate persistence
    - **Property 13: Immediate record persistence**
    - **Validates: Requirements 8.1**
    - Create records, verify they're immediately retrievable from storage
  
  - [ ]* 3.5 Write unit tests for AuthorizationService
    - Test UUID generation uniqueness
    - Test error handling for storage failures
    - Test observable emission on record creation
    - _Requirements: 2.4, 5.3, 8.1_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create atom components
  - [x] 5.1 Create TextInput atom in `src/app/ui/atoms/text-input/text-input.component.ts`
    - Implement `@Input() value: string`
    - Implement `@Input() placeholder: string`
    - Implement `@Input() type: string` (default 'text')
    - Implement `@Input() disabled: boolean`
    - Implement `@Input() error: boolean`
    - Implement `@Output() valueChange: EventEmitter<string>`
    - Implement `@Output() blur: EventEmitter<void>`
    - Implement `@Output() focus: EventEmitter<void>`
    - Add CSS styling for error state
    - _Requirements: 2.1, 7.1, 7.2_
  
  - [x] 5.2 Create CheckboxInput atom in `src/app/ui/atoms/checkbox-input/checkbox-input.component.ts`
    - Implement `@Input() checked: boolean`
    - Implement `@Input() label: string`
    - Implement `@Input() disabled: boolean`
    - Implement `@Output() checkedChange: EventEmitter<boolean>`
    - _Requirements: 3.1_
  
  - [x] 5.3 Create Button atom in `src/app/ui/atoms/button/button.component.ts`
    - Implement `@Input() label: string`
    - Implement `@Input() type: 'button' | 'submit' | 'reset'`
    - Implement `@Input() disabled: boolean`
    - Implement `@Input() icon: string` (optional Bootstrap icon class)
    - Implement `@Output() click: EventEmitter<void>`
    - Add CSS styling for primary, secondary, and icon-only variants
    - _Requirements: 1.1, 6.1_
  
  - [x] 5.4 Create Icon atom in `src/app/ui/atoms/icon/icon.component.ts`
    - Implement `@Input() name: string` (Bootstrap icon name)
    - Implement `@Input() size: string` (default '1rem')
    - Implement `@Input() color: string` (optional)
    - Use Bootstrap Icons library
    - _Requirements: 1.1, 6.1_
  
  - [ ]* 5.5 Write unit tests for atom components
    - Test TextInput value binding and events
    - Test CheckboxInput checked state and events
    - Test Button click events and disabled state
    - Test Icon rendering with different names
    - _Requirements: 1.1, 2.1, 3.1, 6.1, 7.1_

- [x] 6. Create molecule components
  - [x] 6.1 Create FormField molecule in `src/app/ui/molecules/form-field/form-field.component.ts`
    - Implement `@Input() label: string`
    - Implement `@Input() required: boolean`
    - Implement `@Input() error: string` (error message)
    - Implement `@Input() hint: string` (optional hint text)
    - Use `<ng-content>` to transclude input atom
    - Display label with required indicator (*)
    - Display error message below input when error is present
    - Display hint text when no error
    - _Requirements: 2.1, 7.1, 7.2_
  
  - [x] 6.2 Create EntryTypeSelector molecule in `src/app/ui/molecules/entry-type-selector/entry-type-selector.component.ts`
    - Implement `@Input() selectedType: 'visitor' | 'courier'`
    - Implement `@Output() typeChange: EventEmitter<'visitor' | 'courier'>`
    - Create radio button group with "Visitante" and "Mensajero" options
    - _Requirements: 1.3, 4.1, 4.3_
  
  - [x] 6.3 Create ValiditySelector molecule in `src/app/ui/molecules/validity-selector/validity-selector.component.ts`
    - Implement `@Input() selectedPeriod: number` (minutes)
    - Implement `@Output() periodChange: EventEmitter<number>`
    - Define validity options: 1 hour (60), 2 hours (120), 4 hours (240), 8 hours (480), 24 hours (1440)
    - Create dropdown or radio group for selection
    - _Requirements: 2.1, 5.1, 5.2_
  
  - [x] 6.4 Create AuthorizationListItem molecule in `src/app/ui/molecules/authorization-list-item/authorization-list-item.component.ts`
    - Implement `@Input() record: AuthorizationRecord`
    - Display first name, last name, ID document
    - Display entry type badge (Visitante/Mensajero)
    - Display creation timestamp (formatted)
    - Display validity period
    - Conditionally display license plate if `hasVehicle` is true
    - Conditionally display order origin and type if `entryType` is 'courier'
    - Add CSS styling for card layout
    - _Requirements: 6.3, 6.4, 6.5_
  
  - [ ]* 6.5 Write property test for AuthorizationListItem rendering
    - **Property 10: Complete record display**
    - **Validates: Requirements 6.3, 6.4, 6.5**
    - Generate random authorization records with various configurations, verify all required fields are rendered
  
  - [ ]* 6.6 Write unit tests for molecule components
    - Test FormField error display and required indicator
    - Test EntryTypeSelector type change events
    - Test ValiditySelector period change events
    - Test AuthorizationListItem conditional field display
    - _Requirements: 1.3, 2.1, 4.1, 5.1, 6.3, 6.4, 6.5, 7.1_

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create AuthorizationFormOrganism
  - [x] 8.1 Create AuthorizationFormOrganism in `src/app/ui/organisms/authorization-form/authorization-form.component.ts`
    - Implement `@Input() visible: boolean`
    - Implement `@Output() formSubmit: EventEmitter<AuthorizationFormValue>`
    - Implement `@Output() formCancel: EventEmitter<void>`
    - Create `FormGroup` with reactive forms
    - Add form controls: firstName, lastName, idDocument, entryType, hasVehicle, licensePlate, validityPeriod, orderOrigin, orderType
    - Implement validators: required, minLength, maxLength, pattern for each field
    - Implement conditional validators for licensePlate (required when hasVehicle=true)
    - Implement conditional validators for orderOrigin and orderType (required when entryType='courier')
    - Subscribe to entryType and hasVehicle changes to update field visibility and validation
    - Compose EntryTypeSelector, FormField, TextInput, CheckboxInput, ValiditySelector molecules
    - Implement form submission handler
    - Implement form reset after successful submission
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1, 7.1, 7.2, 7.3_
  
  - [ ]* 8.2 Write property test for empty field validation
    - **Property 1: Empty mandatory fields prevent submission**
    - **Validates: Requirements 2.2, 7.1**
    - Generate random form states with at least one empty mandatory field, verify submission is prevented
  
  - [ ]* 8.3 Write property test for valid form submission
    - **Property 2: Valid form data enables submission**
    - **Validates: Requirements 2.3, 7.3**
    - Generate random valid form data, verify form is submittable and errors are cleared
  
  - [ ]* 8.4 Write property test for form reset
    - **Property 4: Form resets after successful submission**
    - **Validates: Requirements 2.5**
    - Submit valid forms, verify form is cleared to initial state after each submission
  
  - [ ]* 8.5 Write property test for vehicle fields conditional behavior
    - **Property 5: Vehicle fields conditional behavior**
    - **Validates: Requirements 3.2, 3.3, 3.4**
    - Generate random hasVehicle states, verify license plate field visibility and validation changes accordingly
  
  - [ ]* 8.6 Write property test for courier fields conditional behavior
    - **Property 6: Courier fields conditional behavior**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - Generate random entryType states, verify courier fields visibility and validation changes accordingly
  
  - [ ]* 8.7 Write property test for validation guidance
    - **Property 11: Validation guidance on field focus**
    - **Validates: Requirements 7.2**
    - Generate random invalid field states, verify guidance appears on focus
  
  - [ ]* 8.8 Write unit tests for AuthorizationFormOrganism
    - Test form initialization with default values
    - Test form visibility toggle
    - Test cancel event emission
    - Test specific validation rules (min/max length, patterns)
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 3.2, 3.3, 4.1, 4.2, 7.1, 7.2_

- [x] 9. Create AuthorizationHistoryOrganism
  - [x] 9.1 Create AuthorizationHistoryOrganism in `src/app/ui/organisms/authorization-history/authorization-history.component.ts`
    - Implement `@Input() visible: boolean`
    - Implement `@Input() records: AuthorizationRecord[]`
    - Implement `@Output() close: EventEmitter<void>`
    - Sort records by createdAt descending (most recent first)
    - Use `*ngFor` to render AuthorizationListItem molecules
    - Display empty state message when no records exist
    - Add close button with Icon atom
    - Add CSS styling for modal/overlay layout
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 9.2 Write property test for chronological sorting
    - **Property 9: Chronological record sorting**
    - **Validates: Requirements 6.2**
    - Generate random sets of records with various timestamps, verify they're sorted descending by createdAt
  
  - [ ]* 9.3 Write property test for complete data retrieval
    - **Property 14: Complete data retrieval**
    - **Validates: Requirements 8.2**
    - Create multiple records, open history view, verify all records are displayed
  
  - [ ]* 9.4 Write unit tests for AuthorizationHistoryOrganism
    - Test visibility toggle
    - Test close event emission
    - Test empty state display
    - Test record count display
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Create AuthorizationPage
  - [x] 11.1 Create AuthorizationPage in `src/app/pages/authorization/authorization.component.ts`
    - Inject AuthorizationService
    - Implement state properties: `showForm: boolean`, `showHistory: boolean`
    - Subscribe to `getAllAuthorizations()` observable for records
    - Implement `onPlusButtonClick()` method to show form
    - Implement `onHistoryIconClick()` method to show history
    - Implement `onFormSubmit(formValue: AuthorizationFormValue)` method
    - Call `createAuthorization()` service method on form submit
    - Display success toast notification after successful submission
    - Display error toast notification on submission failure
    - Implement `onFormCancel()` method to hide form
    - Implement `onHistoryClose()` method to hide history
    - Compose AuthorizationFormOrganism and AuthorizationHistoryOrganism
    - Add floating action button (FAB) with plus icon
    - Add history icon button in header/toolbar
    - _Requirements: 1.1, 2.4, 2.5, 6.1, 7.4, 8.1, 8.2_
  
  - [ ]* 11.2 Write property test for success message display
    - **Property 12: Success message after submission**
    - **Validates: Requirements 7.4**
    - Submit valid forms, verify success message is displayed after each submission
  
  - [ ]* 11.3 Write property test for validity period persistence
    - **Property 7: Validity period persistence**
    - **Validates: Requirements 5.2**
    - Generate random validity periods, create records, verify validityPeriod is stored exactly as specified
  
  - [ ]* 11.4 Write integration tests for AuthorizationPage
    - Test complete flow: open form, fill fields, submit, verify record created
    - Test complete flow: create records, open history, verify records displayed
    - Test form cancel closes form without creating record
    - Test history close returns to main view
    - _Requirements: 1.1, 2.4, 6.1, 7.4, 8.1, 8.2_

- [x] 12. Add routing and navigation
  - [x] 12.1 Update `src/app/app.routes.ts`
    - Add route for AuthorizationPage: `{ path: 'authorization', component: AuthorizationPage }`
    - Set as default route or add to navigation menu
    - _Requirements: All requirements (navigation)_
  
  - [ ]* 12.2 Write unit tests for routing
    - Test navigation to authorization page
    - Test route parameter handling (if applicable)
    - _Requirements: All requirements (navigation)_

- [x] 13. Add global styles and Bootstrap Icons
  - [x] 13.1 Install Bootstrap Icons
    - Run `npm install bootstrap-icons`
    - Import Bootstrap Icons CSS in `src/styles.css`
    - _Requirements: 1.1, 6.1_
  
  - [x] 13.2 Add global styles in `src/styles.css`
    - Define color palette for success, error, warning states
    - Define spacing and typography variables
    - Add toast notification styles
    - Add modal/overlay styles
    - Add floating action button (FAB) styles
    - _Requirements: 7.1, 7.4_

- [x] 14. Install and configure fast-check for property-based testing
  - [x] 14.1 Install fast-check
    - Run `npm install --save-dev fast-check`
    - Configure Karma to include fast-check
    - _Requirements: All requirements (testing infrastructure)_
  
  - [x] 14.2 Create property test utilities
    - Create `src/app/testing/generators.ts` with custom generators for AuthorizationRecord and AuthorizationFormValue
    - Create helper functions for common property test patterns
    - _Requirements: All requirements (testing infrastructure)_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Run all unit tests and property tests
  - Verify code coverage meets minimum 80% line coverage and 75% branch coverage
  - Verify all 15 correctness properties are implemented and passing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at reasonable breaks
- Property tests validate universal correctness properties with minimum 100 iterations each
- Unit tests validate specific examples, edge cases, and integration points
- Follow Atomic Design structure strictly: atoms in `src/app/ui/atoms/`, molecules in `src/app/ui/molecules/`, organisms in `src/app/ui/organisms/`, pages in `src/app/pages/`
- Use Angular CLI generators where appropriate: `ng generate component <path>/<name>`
- All components use standalone architecture (no NgModules)
- Use Angular Reactive Forms for all form handling
- Use RxJS observables for reactive state management
