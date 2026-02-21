# Requirements Document

## Introduction

This document specifies the requirements for the administrator post-registration flow in the Atlas Platform property management system. After an administrator completes the initial registration, they must complete a three-screen onboarding process: profile setup, property registration, and a final confirmation screen. This flow ensures administrators provide essential information before accessing the main application.

## Glossary

- **Administrator**: A user with the 'admin' role who manages properties (condominios/conjuntos/ciudadelas)
- **Profile_Setup_Screen**: The first screen where administrators enter personal information
- **Property_Registration_Screen**: The second screen where administrators register their first property
- **Condominium**: A property type representing a residential building or complex (includes Conjunto, Ciudadela, Condominio)
- **Profile_Completion_State**: A flag indicating whether the administrator has completed the profile setup
- **Navigation_Service**: The system component responsible for routing between screens
- **Form_Validator**: The system component that validates form inputs
- **Storage_Service**: The system component that persists user and property data

## Requirements

### Requirement 1: Profile Setup Screen Display

**User Story:** As an administrator who just registered, I want to complete my profile information, so that the system has my contact details and identification.

#### Acceptance Criteria

1. WHEN an administrator accesses the post-registration flow AND the Profile_Completion_State is false, THEN THE Profile_Setup_Screen SHALL be displayed
2. WHEN the Profile_Completion_State is true, THEN THE System SHALL skip the Profile_Setup_Screen and navigate directly to the Property_Registration_Screen
3. THE Profile_Setup_Screen SHALL display a back button (left arrow icon)
4. THE Profile_Setup_Screen SHALL display the title "Profile Setup"
5. THE Profile_Setup_Screen SHALL display three input fields: Full Name, Phone Number, and Admin ID
6. THE Profile_Setup_Screen SHALL display placeholder text "e.g. Marcus Aurelius" for the Full Name field
7. THE Profile_Setup_Screen SHALL display placeholder text "+1 (555) 000-0000" for the Phone Number field
8. THE Profile_Setup_Screen SHALL display placeholder text "ID-883492" for the Admin ID field
9. THE Profile_Setup_Screen SHALL display an active "Save Profile" button with coral/orange color
10. THE Profile_Setup_Screen SHALL NOT display a dark mode toggle button
11. THE Profile_Setup_Screen SHALL NOT display a "Management Role" field
12. THE Profile_Setup_Screen SHALL NOT display an image upload field

### Requirement 2: Profile Setup Form Validation

**User Story:** As an administrator, I want the system to validate my profile information, so that I provide complete and correct data.

#### Acceptance Criteria

1. WHEN the Full Name field is empty, THEN THE Form_Validator SHALL mark the field as invalid
2. WHEN the Phone Number field is empty, THEN THE Form_Validator SHALL mark the field as invalid
3. WHEN the Admin ID field is empty, THEN THE Form_Validator SHALL mark the field as invalid
4. WHEN the Phone Number field contains non-numeric characters (excluding formatting characters), THEN THE Form_Validator SHALL mark the field as invalid
5. WHEN all required fields contain valid data, THEN THE Form_Validator SHALL mark the form as valid

### Requirement 3: Profile Setup Data Persistence

**User Story:** As an administrator, I want my profile information saved when I click "Save Profile", so that I don't have to re-enter it later.

#### Acceptance Criteria

1. WHEN the administrator clicks "Save Profile" AND the form is valid, THEN THE Storage_Service SHALL persist the Full Name, Phone Number, and Admin ID
2. WHEN the profile data is successfully saved, THEN THE Storage_Service SHALL set the Profile_Completion_State to true
3. WHEN the profile data is successfully saved, THEN THE Navigation_Service SHALL navigate to the Property_Registration_Screen
4. WHEN the administrator clicks "Save Profile" AND the form is invalid, THEN THE System SHALL display validation error messages
5. WHEN the administrator clicks the back button, THEN THE Navigation_Service SHALL navigate to the previous screen without saving data

### Requirement 4: Property Registration Screen Display

**User Story:** As an administrator, I want to register my first property, so that I can start managing it in the system.

#### Acceptance Criteria

1. WHEN the administrator completes the Profile_Setup_Screen, THEN THE Property_Registration_Screen SHALL be displayed
2. THE Property_Registration_Screen SHALL display a back button (left arrow icon)
3. THE Property_Registration_Screen SHALL display the title "New Condominium"
4. THE Property_Registration_Screen SHALL display the subtitle "Register a new property to manage"
5. THE Property_Registration_Screen SHALL display a building icon at the top
6. THE Property_Registration_Screen SHALL display four input fields: Condominium Name, Tax ID / CNPJ, Total Units, and Property Type
7. THE Property_Registration_Screen SHALL display placeholder text "e.g. Sunset Towers" for the Condominium Name field
8. THE Property_Registration_Screen SHALL display placeholder text "00.000.000/0001-00" for the Tax ID / CNPJ field
9. THE Property_Registration_Screen SHALL display placeholder text "e.g. 48" for the Total Units field
10. THE Property_Registration_Screen SHALL display a dropdown selector for Property Type with options: Conjunto, Ciudadela, Condominio
11. THE Property_Registration_Screen SHALL display a "Register Condominium" button with coral/orange color
12. THE Property_Registration_Screen SHALL NOT display a three-dot menu button
13. THE Property_Registration_Screen SHALL NOT display a "Location (Optional)" field with map

### Requirement 5: Property Registration Form Validation

**User Story:** As an administrator, I want the system to validate my property information, so that I provide complete and correct data.

#### Acceptance Criteria

1. WHEN the Condominium Name field is empty, THEN THE Form_Validator SHALL mark the field as invalid
2. WHEN the Tax ID / CNPJ field is empty, THEN THE Form_Validator SHALL mark the field as invalid
3. WHEN the Tax ID / CNPJ field does not match the format "XX.XXX.XXX/XXXX-XX", THEN THE Form_Validator SHALL mark the field as invalid
4. WHEN the Total Units field is empty, THEN THE Form_Validator SHALL mark the field as invalid
5. WHEN the Total Units field contains a value less than 1, THEN THE Form_Validator SHALL mark the field as invalid
6. WHEN the Total Units field contains non-numeric characters, THEN THE Form_Validator SHALL mark the field as invalid
7. WHEN the Property Type field has no selection, THEN THE Form_Validator SHALL mark the field as invalid
8. WHEN all required fields contain valid data, THEN THE Form_Validator SHALL mark the form as valid

### Requirement 6: Property Registration Data Persistence

**User Story:** As an administrator, I want my property information saved when I click "Register Condominium", so that the property is created in the system.

#### Acceptance Criteria

1. WHEN the administrator clicks "Register Condominium" AND the form is valid, THEN THE Storage_Service SHALL create a new Condominium entity with the provided data
2. WHEN the Condominium entity is successfully created, THEN THE Storage_Service SHALL associate the Condominium with the administrator's user account
3. WHEN the Condominium entity is successfully created, THEN THE Navigation_Service SHALL navigate to Screen 3
4. WHEN the administrator clicks "Register Condominium" AND the form is invalid, THEN THE System SHALL display validation error messages
5. WHEN the administrator clicks the back button, THEN THE Navigation_Service SHALL navigate to the Profile_Setup_Screen without saving data

### Requirement 7: Navigation Flow Control

**User Story:** As an administrator, I want to navigate through the onboarding screens in the correct order, so that I complete all required steps.

#### Acceptance Criteria

1. WHEN the administrator first accesses the post-registration flow, THEN THE Navigation_Service SHALL display the Profile_Setup_Screen
2. WHEN the administrator completes the Profile_Setup_Screen, THEN THE Navigation_Service SHALL display the Property_Registration_Screen
3. WHEN the administrator completes the Property_Registration_Screen, THEN THE Navigation_Service SHALL display Screen 3
4. WHEN the administrator clicks a back button on any screen, THEN THE Navigation_Service SHALL navigate to the previous screen in the flow
5. WHEN the administrator has already completed the Profile_Setup_Screen in a previous session, THEN THE Navigation_Service SHALL skip directly to the Property_Registration_Screen

### Requirement 8: Form State Management

**User Story:** As an administrator, I want my form inputs to be managed reactively, so that the UI responds immediately to my actions.

#### Acceptance Criteria

1. WHEN the administrator types in any input field, THEN THE System SHALL update the form state immediately using RxJS observables
2. WHEN the form state changes, THEN THE System SHALL re-evaluate form validity in real-time
3. WHEN the form becomes valid, THEN THE System SHALL enable the submit button
4. WHEN the form becomes invalid, THEN THE System SHALL disable the submit button
5. WHEN validation errors occur, THEN THE System SHALL display error messages below the relevant input fields

### Requirement 9: Component Architecture

**User Story:** As a developer, I want the UI components organized following Atomic Design principles, so that the codebase is maintainable and scalable.

#### Acceptance Criteria

1. THE System SHALL implement input fields as atoms in src/app/ui/atoms/
2. THE System SHALL implement form sections as molecules in src/app/ui/molecules/
3. THE System SHALL implement complete forms as organisms in src/app/ui/organisms/
4. THE System SHALL implement screen layouts as pages in src/app/pages/
5. THE System SHALL use standalone components following Angular 18 architecture
6. THE System SHALL keep data fetching and business logic in page components, not in atoms or molecules

### Requirement 10: Accessibility and User Experience

**User Story:** As an administrator, I want the forms to be accessible and easy to use, so that I can complete the onboarding process efficiently.

#### Acceptance Criteria

1. WHEN any input field receives focus, THEN THE System SHALL display a visual focus indicator
2. WHEN validation errors occur, THEN THE System SHALL display clear, descriptive error messages
3. THE System SHALL support keyboard navigation through all form fields using the Tab key
4. THE System SHALL provide appropriate ARIA labels for all form inputs and buttons
5. WHEN the administrator submits a form, THEN THE System SHALL provide visual feedback (loading state) during data persistence
