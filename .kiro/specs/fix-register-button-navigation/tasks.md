# Implementation Plan: Fix Register Button Navigation

## Overview

This implementation plan changes the behavior of the central "+" button from navigating to the `/authorization` route to displaying the authorization form as an overlay on the home page. The implementation involves adding state management to `HomeComponent`, including the `AuthorizationFormComponent` in the template, and modifying event handlers to control overlay visibility.

## Tasks

- [x] 1. Add overlay state management to HomeComponent
  - Add `showFormOverlay: boolean = false;` property to the component class
  - Import `AuthorizationFormComponent` in the component imports array
  - Import `AuthorizationFormValue` interface from models
  - File: `src/app/pages/home/home.component.ts`
  - _Requirements: 2.1, 5.5_

- [x] 2. Modify onRegisterVisit method to show overlay
  - Change the method to set `this.showFormOverlay = true;` instead of calling `router.navigate()`
  - Remove the navigation call completely
  - File: `src/app/pages/home/home.component.ts`
  - _Requirements: 1.1, 2.2, 6.1, 6.2_

- [x] 3. Add event handler methods for form interactions
  - [x] 3.1 Create `onFormCancel()` method that sets `showFormOverlay` to false
    - Method signature: `onFormCancel(): void`
    - Implementation: `this.showFormOverlay = false;`
    - _Requirements: 3.2_
  
  - [x] 3.2 Create `onFormSubmit(formValue: AuthorizationFormValue)` method
    - Method signature: `onFormSubmit(formValue: AuthorizationFormValue): void`
    - Log the form value for debugging: `console.log('Form submitted:', formValue);`
    - Set `showFormOverlay` to false
    - _Requirements: 4.2_

- [x] 4. Add authorization form to home template
  - Add `<app-authorization-form>` element at the end of the template (before closing `</div>` of `.home-page`)
  - Bind `[visible]` input to `showFormOverlay` property
  - Bind `(formSubmit)` output to `onFormSubmit($event)` method
  - Bind `(formCancel)` output to `onFormCancel()` method
  - File: `src/app/pages/home/home.component.html`
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5. Checkpoint - Manual verification
  - Start the development server (`npm start`)
  - Navigate to the home page
  - Click the "+" button in bottom navigation
  - Verify the authorization form appears as an overlay
  - Verify the home page content is visible underneath
  - Click cancel button and verify overlay closes
  - Open overlay again, fill form, and submit
  - Verify overlay closes after submission
  - Verify form data is logged to console
  - Verify no navigation occurs (URL stays on home page)
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 6. Write unit tests for overlay state management
  - [ ]* 6.1 Test initial state
    - Verify `showFormOverlay` initializes to `false`
    - **Example 1: Show Overlay on Button Click**
    - _Requirements: 2.1_
  
  - [ ]* 6.2 Test onRegisterVisit method
    - Verify calling `onRegisterVisit()` sets `showFormOverlay` to `true`
    - **Example 1: Show Overlay on Button Click**
    - _Requirements: 1.1, 2.2_
  
  - [ ]* 6.3 Test onFormCancel method
    - Set `showFormOverlay` to `true`, call `onFormCancel()`, verify it becomes `false`
    - **Example 3: Hide Overlay on Cancel**
    - _Requirements: 3.2_
  
  - [ ]* 6.4 Test onFormSubmit method
    - Set `showFormOverlay` to `true`, call `onFormSubmit()` with mock data, verify it becomes `false`
    - **Example 4: Hide Overlay on Submit**
    - _Requirements: 4.2_
  
  - [ ]* 6.5 Test no navigation occurs
    - Create router spy, call `onRegisterVisit()`, verify `router.navigate()` was NOT called
    - **Example 5: No Navigation Occurs**
    - _Requirements: 1.3, 6.1_

- [ ]* 7. Write integration tests for component interaction
  - [ ]* 7.1 Test form component rendering
    - Set `showFormOverlay` to `true`, verify `app-authorization-form` element is present in DOM
    - **Example 6: Template Includes Form Component**
    - _Requirements: 5.1_
  
  - [ ]* 7.2 Test visible input binding
    - Set `showFormOverlay` to `true`, verify form component receives `visible: true`
    - Set `showFormOverlay` to `false`, verify form component receives `visible: false`
    - **Example 2: Overlay Visibility Binding**
    - _Requirements: 2.3, 2.4_
  
  - [ ]* 7.3 Test formCancel event binding
    - Set `showFormOverlay` to `true`, emit `formCancel` from child, verify parent state becomes `false`
    - **Example 3: Hide Overlay on Cancel**
    - _Requirements: 3.2_
  
  - [ ]* 7.4 Test formSubmit event binding
    - Set `showFormOverlay` to `true`, emit `formSubmit` with data from child, verify parent state becomes `false`
    - **Example 4: Hide Overlay on Submit**
    - _Requirements: 4.2_

- [x] 8. Optional cleanup - Remove unused Router injection
  - Check if `Router` service is used in any other methods (`onNoticeBoard`, `onAmenities`, `onMaintenance`)
  - If not used elsewhere, remove `private router: Router` from constructor
  - If used elsewhere, keep the injection for future use
  - File: `src/app/pages/home/home.component.ts`
  - _Requirements: 6.4_

## Notes

- Tasks marked with `*` are optional test tasks and can be skipped for faster deployment
- The core implementation is in tasks 1-4 (state management, event handlers, template changes)
- Task 5 is a manual verification checkpoint to ensure the feature works end-to-end
- Tasks 6-7 provide comprehensive test coverage for the new functionality
- Task 8 is optional cleanup that can be done if Router is no longer needed
- The `AuthorizationFormComponent` already has all necessary inputs/outputs and requires no changes
- The `BottomNavComponent` already emits the correct event and requires no changes
- Each test task references the specific example from the design document's Correctness Properties section
