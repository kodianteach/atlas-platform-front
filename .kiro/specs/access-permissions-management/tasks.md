# Implementation Plan: Access Permissions Management

## Overview

Este plan implementa la funcionalidad de gestión de permisos de acceso siguiendo la arquitectura Atomic Design de Angular 18. La implementación se realizará de forma incremental, comenzando por los componentes atómicos más básicos, luego moléculas y organismos, y finalmente la página completa con integración de servicios. Cada paso incluye la creación de componentes standalone con sus respectivos archivos de prueba.

## Tasks

- [x] 1. Set up data models and service infrastructure
  - Create Authorization interface and related types in a shared models file
  - Create AuthorizationService with methods for fetching and updating authorizations
  - Set up RxJS observables for reactive data flow
  - _Requirements: 1.1, 3.4, 5.1, 5.2, 5.3_

- [ ]* 1.1 Write unit tests for AuthorizationService
  - Test getAuthorizations() returns expected data structure
  - Test toggleAuthorizationStatus() calls correct methods
  - Test error handling for service failures
  - _Requirements: 5.3_

- [x] 2. Create atomic components (atoms)
  - [x] 2.1 Create ToggleSwitchAtom component
    - Generate component in src/app/ui/atoms/toggle-switch/
    - Implement @Input() for checked, disabled, ariaLabel
    - Implement @Output() for change event
    - Add accessible markup with role="switch" and aria-checked
    - Style with focus indicators for keyboard navigation
    - _Requirements: 5.1, 5.2, 8.1, 8.2, 8.3, 8.5_

  - [ ]* 2.2 Write property test for ToggleSwitchAtom
    - **Property 6: Toggle State Transition**
    - **Validates: Requirements 5.1, 5.2**

  - [ ]* 2.3 Write property test for ToggleSwitchAtom accessibility
    - **Property 9: Interactive Elements Accessibility**
    - **Property 10: Keyboard Navigation Support**
    - **Property 11: Focus Indicator Visibility**
    - **Validates: Requirements 8.1, 8.2, 8.3**

- [x] 3. Create molecular components (molecules)
  - [x] 3.1 Create AuthorizationItemMolecule component
    - Generate component in src/app/ui/molecules/authorization-item/
    - Implement @Input() for authorization object and isActive state
    - Implement @Output() for toggle event
    - Compose IconAtom, text elements, and ToggleSwitchAtom
    - Display authorization name, icon, and details based on type
    - Add conditional rendering for permanent vs scheduled access details
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 3.2 Write property test for AuthorizationItemMolecule
    - **Property 3: Authorization Display Completeness**
    - **Property 4: Permanent Access Display Format**
    - **Property 5: Scheduled Access Display Format**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

  - [x] 3.3 Create ListHeaderMolecule component
    - Generate component in src/app/ui/molecules/list-header/
    - Implement @Input() for title and count
    - Compose title text and BadgeAtom for count display
    - _Requirements: 3.2_

- [x] 4. Create organism components (organisms)
  - [x] 4.1 Create PageHeaderOrganism component
    - Generate component in src/app/ui/organisms/page-header/
    - Implement @Input() for title, showBackButton, showHistoryButton
    - Implement @Output() for backClick and historyClick events
    - Compose ButtonAtom components for back and history buttons
    - Add ARIA labels for navigation buttons
    - _Requirements: 1.2, 1.3, 6.1, 6.2, 8.1_

  - [ ]* 4.2 Write property test for PageHeaderOrganism navigation
    - **Property 1: Navigation Button Behavior** (partial - back and history)
    - **Validates: Requirements 1.3, 6.2**

  - [x] 4.3 Create GrantAuthorizationCardOrganism component
    - Generate component in src/app/ui/organisms/grant-authorization-card/
    - Implement @Input() for title, description, icon
    - Implement @Output() for createClick event
    - Compose IconAtom, text elements, and ButtonAtom
    - Style as prominent card with visual hierarchy
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 4.4 Write property test for GrantAuthorizationCardOrganism
    - **Property 1: Navigation Button Behavior** (partial - create button)
    - **Validates: Requirements 2.4**

  - [x] 4.5 Create AuthorizationListOrganism component
    - Generate component in src/app/ui/organisms/authorization-list/
    - Implement @Input() for authorizations array and activeCount
    - Implement @Output() for toggleAuthorization event with authorization ID
    - Compose ListHeaderMolecule and multiple AuthorizationItemMolecule components
    - Add empty state handling with conditional rendering
    - Add role="list" and role="listitem" for accessibility
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.4, 8.5_

  - [ ]* 4.6 Write property test for AuthorizationListOrganism
    - **Property 2: Authorization List Rendering**
    - **Property 13: ARIA Roles for Structures**
    - **Validates: Requirements 3.4, 8.5**

  - [ ]* 4.7 Write unit test for AuthorizationListOrganism empty state
    - Test empty state message displays when authorizations array is empty
    - _Requirements: 3.3_

- [x] 5. Checkpoint - Ensure all component tests pass
  - Run ng test to verify all component unit and property tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Create page component and integrate routing
  - [x] 6.1 Create AccessPermissionsComponent page
    - Generate component in src/app/pages/access-permissions/
    - Inject AuthorizationService and Router
    - Implement ngOnInit to fetch authorizations from service
    - Implement state management for authorizations list and loading/error states
    - Compose PageHeaderOrganism, GrantAuthorizationCardOrganism, and AuthorizationListOrganism
    - Implement event handlers for navigation (back, history, create)
    - Implement event handler for toggle with service call and state update
    - Calculate activeCount from authorizations array
    - _Requirements: 1.1, 1.2, 1.3, 2.4, 5.1, 5.2, 5.3, 5.4, 6.2_

  - [x] 6.2 Add route configuration
    - Add access-permissions route to src/app/app.routes.ts with lazy loading
    - _Requirements: 1.1_

  - [x] 6.3 Update BottomNavComponent to navigate to access-permissions
    - Modify bottom-nav component to emit navigation to /access-permissions on center button click
    - Update parent component to handle centerAction event with router navigation
    - _Requirements: 1.1_

  - [ ]* 6.4 Write property test for AccessPermissionsComponent
    - **Property 7: Toggle Persistence**
    - **Property 8: Active Count Update**
    - **Validates: Requirements 5.3, 5.4**

  - [ ]* 6.5 Write integration test for page navigation
    - Test navigation from bottom nav to access permissions page
    - Test back button navigation
    - Test history button navigation
    - Test create button navigation
    - _Requirements: 1.1, 1.3, 2.4, 6.2_

- [x] 7. Create test data generators
  - [x] 7.1 Create property-based test generators
    - Create src/app/testing/generators.ts if it doesn't exist
    - Implement generateAuthorization() for random valid authorization objects
    - Implement generateAuthorizationList() for random arrays of authorizations
    - Implement generateSchedule() for random valid schedule configurations
    - Ensure generators cover both permanent and scheduled authorization types
    - _Requirements: All property tests_

- [x] 8. Implement error handling and loading states
  - [x] 8.1 Add error handling to AccessPermissionsComponent
    - Implement error state display when service fails
    - Add retry button for failed data fetches
    - Implement error toast for failed toggle operations with state reversion
    - _Requirements: 5.3_

  - [x] 8.2 Add loading state to AccessPermissionsComponent
    - Implement loading state display during data fetch
    - Add loading skeleton or spinner in list area
    - Prevent interaction during loading
    - _Requirements: 3.4_

  - [ ]* 8.3 Write unit tests for error and loading states
    - Test error state displays when service returns error
    - Test loading state displays during async operations
    - Test retry functionality
    - _Requirements: 5.3_

- [x] 9. Implement accessibility features
  - [x] 9.1 Add comprehensive ARIA labels
    - Ensure all buttons have aria-label attributes
    - Add aria-labelledby for complex components
    - Verify toggle switches have proper aria-checked state
    - _Requirements: 8.1, 8.5_

  - [x] 9.2 Implement keyboard navigation
    - Ensure all interactive elements have proper tabindex
    - Add keyboard event handlers for Enter and Space on custom controls
    - Verify logical tab order follows visual order
    - _Requirements: 8.2, 8.4_

  - [x] 9.3 Add focus indicators
    - Implement CSS focus styles for all interactive elements
    - Ensure focus indicators are visible and meet contrast requirements
    - Test focus visibility with keyboard navigation
    - _Requirements: 8.3_

  - [ ]* 9.4 Write property tests for accessibility
    - **Property 12: Logical Tab Order**
    - **Validates: Requirements 8.4**

- [ ] 10. Final checkpoint - Ensure all tests pass and feature is complete
  - Run ng test to verify all unit and property tests pass
  - Manually test navigation flow from bottom nav to access permissions
  - Verify toggle functionality works end-to-end
  - Test keyboard navigation and screen reader compatibility
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- All components follow Angular 18 standalone architecture
- All components must be placed in correct Atomic Design directories
- Use Angular CLI commands (ng generate) for component scaffolding
- Each component must have 4 files: .ts, .html, .css, .spec.ts
