# Requirements Document

## Introduction

This document specifies the requirements for an authorization entry registration system that allows security personnel or administrators to register visitor and courier entries, manage authorization validity periods, and view historical authorization records. The system provides a streamlined interface for capturing essential visitor information and tracking deliveries through a web-based Angular application.

## Glossary

- **Authorization_System**: The web application component responsible for managing visitor and courier entry registrations
- **Entry_Form**: The user interface component for capturing visitor or courier information
- **Visitor**: A person requesting entry to the premises who is not delivering goods
- **Courier**: A person delivering goods or packages to the premises
- **Authorization_Record**: A stored entry containing all captured information about a visitor or courier authorization
- **Validity_Period**: The time duration for which an authorization remains active
- **History_View**: The interface displaying all previously created authorization records
- **License_Plate**: Vehicle identification number (placa)
- **Order_Origin**: The source location or company from which a delivery originates
- **Order_Type**: The category or classification of the delivery being made

## Requirements

### Requirement 1: Display Entry Form

**User Story:** As a security administrator, I want to open an entry registration form, so that I can begin capturing visitor or courier information.

#### Acceptance Criteria

1. WHEN a user clicks the plus (+) button, THEN THE Authorization_System SHALL display the Entry_Form
2. WHEN the Entry_Form is displayed, THEN THE Authorization_System SHALL show all mandatory visitor fields
3. WHEN the Entry_Form is displayed, THEN THE Authorization_System SHALL provide options to select between visitor and courier entry types

### Requirement 2: Capture Visitor Information

**User Story:** As a security administrator, I want to capture basic visitor information, so that I can create a valid authorization record.

#### Acceptance Criteria

1. THE Entry_Form SHALL provide input fields for Nombres (first name), Apellidos (last name), Documento de Identidad (ID document), and Vigencia (validity period)
2. WHEN a user attempts to submit the form with any mandatory field empty, THEN THE Authorization_System SHALL prevent submission and display validation errors
3. WHEN a user enters valid data in all mandatory fields, THEN THE Authorization_System SHALL enable form submission
4. WHEN a user successfully submits the visitor form, THEN THE Authorization_System SHALL create an Authorization_Record with all captured information
5. WHEN an Authorization_Record is created, THEN THE Authorization_System SHALL clear the Entry_Form and return to the ready state

### Requirement 3: Conditional Vehicle Information

**User Story:** As a security administrator, I want to capture vehicle information only when relevant, so that I can track visitors arriving by car without cluttering the form for pedestrians.

#### Acceptance Criteria

1. THE Entry_Form SHALL provide a mechanism for users to indicate whether the visitor is arriving by vehicle
2. WHEN a user indicates the visitor is arriving by vehicle, THEN THE Authorization_System SHALL display the Placa (license plate) input field
3. WHEN a user indicates the visitor is arriving by vehicle, THEN THE Authorization_System SHALL require the Placa field for form submission
4. WHEN a user indicates the visitor is not arriving by vehicle, THEN THE Authorization_System SHALL hide the Placa field and exclude it from validation
5. WHEN an Authorization_Record is created for a visitor with a vehicle, THEN THE Authorization_System SHALL store the License_Plate information

### Requirement 4: Capture Courier-Specific Information

**User Story:** As a security administrator, I want to capture delivery details for couriers, so that I can track incoming packages and their origins.

#### Acceptance Criteria

1. WHEN a user selects the courier entry type, THEN THE Authorization_System SHALL display additional fields for Origen del Pedido (order origin) and Tipo de Pedido (order type)
2. WHEN the courier entry type is selected, THEN THE Authorization_System SHALL require Order_Origin and Order_Type fields for form submission
3. WHEN a user selects the visitor entry type, THEN THE Authorization_System SHALL hide courier-specific fields and exclude them from validation
4. WHEN an Authorization_Record is created for a courier, THEN THE Authorization_System SHALL store the Order_Origin and Order_Type information

### Requirement 5: Manage Authorization Validity

**User Story:** As a security administrator, I want to set how long an authorization remains active, so that I can control access duration based on visit purpose.

#### Acceptance Criteria

1. THE Entry_Form SHALL provide a time selector interface for specifying the Validity_Period
2. WHEN a user selects a Validity_Period, THEN THE Authorization_System SHALL store this duration with the Authorization_Record
3. WHEN an Authorization_Record is created, THEN THE Authorization_System SHALL calculate and store the expiration timestamp based on the current time and Validity_Period

### Requirement 6: Display Authorization History

**User Story:** As a security administrator, I want to view all previous authorizations, so that I can review entry records and track visitor patterns.

#### Acceptance Criteria

1. WHEN a user clicks the clock-history icon (bi bi-clock-history), THEN THE Authorization_System SHALL display the History_View
2. WHEN the History_View is displayed, THEN THE Authorization_System SHALL show all Authorization_Records in chronological order with most recent first
3. WHEN displaying Authorization_Records, THEN THE Authorization_System SHALL include visitor name, ID document, entry type, timestamp, and validity period for each record
4. WHEN displaying Authorization_Records for visitors with vehicles, THEN THE Authorization_System SHALL include the License_Plate information
5. WHEN displaying Authorization_Records for couriers, THEN THE Authorization_System SHALL include the Order_Origin and Order_Type information

### Requirement 7: Form Validation and User Feedback

**User Story:** As a security administrator, I want clear feedback on form errors, so that I can quickly correct issues and complete the registration.

#### Acceptance Criteria

1. WHEN a mandatory field is empty and the user attempts to submit, THEN THE Authorization_System SHALL display a field-specific error message
2. WHEN a user focuses on an invalid field, THEN THE Authorization_System SHALL display validation guidance
3. WHEN all validation errors are resolved, THEN THE Authorization_System SHALL remove error messages and enable submission
4. WHEN form submission succeeds, THEN THE Authorization_System SHALL display a success confirmation message

### Requirement 8: Data Persistence

**User Story:** As a security administrator, I want authorization records to be stored reliably, so that I can access historical data across sessions.

#### Acceptance Criteria

1. WHEN an Authorization_Record is created, THEN THE Authorization_System SHALL persist the record to storage immediately
2. WHEN the History_View is opened, THEN THE Authorization_System SHALL retrieve all stored Authorization_Records
3. WHEN the application is reloaded, THEN THE Authorization_System SHALL maintain access to all previously created Authorization_Records
