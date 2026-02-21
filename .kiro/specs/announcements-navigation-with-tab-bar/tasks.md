# Implementation Plan: Announcements Navigation with Tab Bar

## Overview

This implementation adds navigation from the home page "Notice Board" quick action card to the announcements page and integrates the bottom navigation tab bar into the announcements page. The work involves updating the home component's navigation handler, adding the bottom nav component to the announcements page template, implementing the center action handler, and adjusting CSS for proper layout.

## Tasks

- [ ] 1. Update HomeComponent to navigate to announcements
  - [x] 1.1 Inject Router service and implement navigation in onNoticeBoard() method
    - Import Router from '@angular/router' in home.component.ts
    - Add Router to constructor parameters
    - Update onNoticeBoard() method to call router.navigate(['/announcements'])
    - Add error handling with .catch() and console.error logging
    - _Requirements: 1.1, 1.4_
  
  - [ ]* 1.2 Write unit test for notice board navigation
    - Test that clicking notice board calls router.navigate with ['/announcements']
    - Test error handling when navigation fails
    - Verify console.error is called on navigation failure
    - _Requirements: 1.1, 1.4_

- [ ] 2. Add bottom navigation to AnnouncementsComponent
  - [x] 2.1 Import BottomNavComponent and add to announcements page template
    - Add BottomNavComponent to imports array in announcements.component.ts
    - Add <app-bottom-nav> element to announcements.component.html before closing </div>
    - Bind (centerAction) output event to component method
    - _Requirements: 2.1, 2.2_
  
  - [ ]* 2.2 Write property test for bottom nav visibility
    - **Property 3: Bottom Navigation is Fixed at Bottom of Viewport**
    - **Validates: Requirements 2.1, 2.3**
    - Generate random announcements page states
    - Verify bottom nav component is present in DOM
    - Verify bottom nav has fixed positioning CSS
  
  - [x] 2.3 Update announcements page CSS for bottom nav layout
    - Add bottom padding to .announcements-page (80px for bottom nav space)
    - Ensure .announcements-page uses flexbox layout
    - Add padding-bottom to .announcements-content for additional spacing
    - _Requirements: 2.4, 3.2_
  
  - [ ]* 2.4 Write property test for content padding
    - **Property 4: Content Area Has Adequate Padding**
    - **Validates: Requirements 2.4, 3.2**
    - Generate content of varying lengths
    - Verify content container has bottom padding >= bottom nav height
    - Check that content doesn't overlap with bottom nav

- [ ] 3. Implement center action handler in AnnouncementsComponent
  - [x] 3.1 Add authorization form overlay functionality
    - Import AuthorizationFormComponent in announcements.component.ts
    - Add AuthorizationFormComponent to imports array
    - Add showFormOverlay property (boolean, default false)
    - Implement onCenterAction() method to set showFormOverlay to true
    - Implement onFormCancel() method to set showFormOverlay to false
    - Implement onFormSubmit() method to log data and close overlay
    - Import AuthorizationFormValue type from models
    - _Requirements: 4.3_
  
  - [x] 3.2 Add authorization form to announcements template
    - Add <app-authorization-form> component to announcements.component.html
    - Bind [visible] input to showFormOverlay property
    - Bind (formSubmit) output to onFormSubmit($event)
    - Bind (formCancel) output to onFormCancel()
    - _Requirements: 4.3_
  
  - [ ]* 3.3 Write property test for center action button
    - **Property 6: Center Action Button Shows Authorization Form**
    - **Validates: Requirements 4.3**
    - Generate random component states
    - Simulate center button click
    - Verify showFormOverlay becomes true
    - Verify authorization form component is rendered

- [x] 4. Checkpoint - Verify navigation and layout
  - Manually test clicking "Notice Board" card navigates to announcements
  - Verify bottom nav appears on announcements page
  - Verify center button shows authorization form overlay
  - Verify content doesn't overlap with bottom nav
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 5. Write integration tests for complete navigation flow
  - [ ]* 5.1 Write property test for navigation triggering route change
    - **Property 1: Notice Board Navigation Triggers Route Change**
    - **Validates: Requirements 1.1**
    - Generate random home component states
    - Simulate notice board card click
    - Verify router.navigate called with ['/announcements']
  
  - [ ]* 5.2 Write property test for announcements page rendering
    - **Property 2: Announcements Page Renders After Navigation**
    - **Validates: Requirements 1.3**
    - Navigate to /announcements route
    - Verify header component is present
    - Verify content area is present
  
  - [ ]* 5.3 Write property test for bottom nav item clicks
    - **Property 5: Bottom Navigation Items Trigger Route Changes**
    - **Validates: Requirements 4.2**
    - Generate clicks on different nav items
    - Verify router.navigate called with correct route for each item

- [x] 6. Final checkpoint - Complete testing and validation
  - Run all unit tests and property tests
  - Verify no console errors during navigation
  - Test on different viewport sizes
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation reuses existing components (BottomNavComponent, AuthorizationFormComponent)
- Property tests should use fast-check library with minimum 100 iterations
- CSS changes ensure proper spacing without breaking existing layout
- Error handling follows existing patterns from HomeComponent
