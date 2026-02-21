# Requirements Document

## Introduction

This document specifies the requirements for changing the navigation behavior of the central "+" button in the bottom navigation bar. Currently, the button navigates to the `/authorization` route, but the authorization form component is designed to be displayed as an overlay/modal on the home page. This feature will modify the behavior to show the form as an overlay instead of navigating away from the home page.

## Glossary

- **Bottom_Nav_Component**: The bottom navigation bar organism component that contains the center "+" button
- **Home_Component**: The home page component that will manage the overlay visibility state
- **Authorization_Form_Component**: The organism component that displays the authorization registration form with overlay capabilities
- **Center_Button**: The central "+" button in the bottom navigation bar with aria-label "Registrar Visita"
- **Overlay**: A modal-style UI element that appears on top of the current page with a backdrop
- **Form_Visibility_State**: A boolean flag in Home_Component that controls whether the authorization form overlay is visible

## Requirements

### Requirement 1: Display Authorization Form as Overlay

**User Story:** As a user, I want to click the "+" button in the bottom navigation bar, so that the authorization form appears as an overlay on top of the home page without navigating away.

#### Acceptance Criteria

1. WHEN a user clicks the Center_Button THEN the Authorization_Form_Component SHALL appear as an overlay on the Home_Component
2. WHEN the Authorization_Form_Component is displayed as an overlay THEN the Home_Component SHALL remain visible underneath with a backdrop
3. WHEN the overlay is displayed THEN the system SHALL NOT navigate to a different route
4. WHEN the overlay is displayed THEN the browser URL SHALL remain unchanged at the home page route

### Requirement 2: Form Visibility State Management

**User Story:** As a developer, I want the home component to manage the form visibility state, so that the overlay can be shown and hidden based on user interactions.

#### Acceptance Criteria

1. THE Home_Component SHALL maintain a Form_Visibility_State property to control overlay visibility
2. WHEN the Center_Button is clicked THEN the Home_Component SHALL set Form_Visibility_State to true
3. WHEN Form_Visibility_State is true THEN the Authorization_Form_Component SHALL be rendered with visible input set to true
4. WHEN Form_Visibility_State is false THEN the Authorization_Form_Component SHALL be hidden

### Requirement 3: Close Overlay on Cancel

**User Story:** As a user, I want to close the authorization form overlay by clicking a cancel or close button, so that I can return to viewing the home page without the form.

#### Acceptance Criteria

1. WHEN a user triggers the form cancel action THEN the Authorization_Form_Component SHALL emit the formCancel event
2. WHEN the Home_Component receives the formCancel event THEN the system SHALL set Form_Visibility_State to false
3. WHEN Form_Visibility_State is set to false THEN the overlay SHALL be hidden
4. WHEN the overlay is hidden THEN the Home_Component SHALL be fully visible without any backdrop

### Requirement 4: Close Overlay on Successful Submit

**User Story:** As a user, I want the authorization form overlay to close automatically after I successfully submit the form, so that I can see the home page again.

#### Acceptance Criteria

1. WHEN a user submits a valid form THEN the Authorization_Form_Component SHALL emit the formSubmit event with form data
2. WHEN the Home_Component receives the formSubmit event THEN the system SHALL set Form_Visibility_State to false
3. WHEN Form_Visibility_State is set to false after submission THEN the overlay SHALL be hidden
4. WHEN the overlay is hidden after submission THEN the Home_Component SHALL be fully visible

### Requirement 5: Include Authorization Form in Home Template

**User Story:** As a developer, I want the authorization form component to be included in the home page template, so that it can be displayed as an overlay without routing.

#### Acceptance Criteria

1. THE Home_Component template SHALL include the Authorization_Form_Component element
2. THE Authorization_Form_Component element SHALL bind the visible input to Form_Visibility_State
3. THE Authorization_Form_Component element SHALL bind the formCancel output to a cancel handler method
4. THE Authorization_Form_Component element SHALL bind the formSubmit output to a submit handler method
5. THE Home_Component SHALL import the Authorization_Form_Component in its imports array

### Requirement 6: Remove Navigation Logic

**User Story:** As a developer, I want to remove the route navigation logic from the register visit handler, so that the system uses the overlay approach instead.

#### Acceptance Criteria

1. THE Home_Component onRegisterVisit method SHALL NOT call router.navigate
2. THE Home_Component onRegisterVisit method SHALL set Form_Visibility_State to true
3. WHEN the onRegisterVisit method is called THEN the system SHALL NOT change the browser URL
4. THE Home_Component MAY remove the Router service injection if it is not used elsewhere
