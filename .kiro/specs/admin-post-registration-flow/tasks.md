# Tasks: Admin Post-Registration Flow

## 1. Profile Setup Screen (First View)
- [ ] 1.1 Create profile-setup page component
  - [x] 1.1.1 Create page component in `src/app/pages/admin/profile-setup/`
  - [x] 1.1.2 Add route configuration for `/admin/profile-setup`
  - [x] 1.1.3 Implement navigation guard to check if profile is already completed

- [x] 1.2 Create profile-setup-form organism
  - [x] 1.2.1 Create organism component in `src/app/ui/organisms/profile-setup-form/`
  - [x] 1.2.2 Implement form with fields: Full Name, Phone Number, Admin ID
  - [x] 1.2.3 Remove Upload Photo functionality
  - [x] 1.2.4 Remove Management Role selector
  - [x] 1.2.5 Remove moon/dark mode button
  - [x] 1.2.6 Implement form validation (all fields required)
  - [x] 1.2.7 Keep Save Profile button always enabled
  - [x] 1.2.8 Emit form submission event to parent page

- [x] 1.3 Implement profile completion logic
  - [x] 1.3.1 Create or update admin profile service method
  - [x] 1.3.2 Add profile completion flag to user model
  - [x] 1.3.3 Implement save profile functionality in page component
  - [x] 1.3.4 Navigate to property registration on successful save

## 2. Property Registration Screen (Second View)
- [x] 2.1 Create property-registration page component
  - [x] 2.1.1 Create page component in `src/app/pages/admin/property-registration/`
  - [x] 2.1.2 Add route configuration for `/admin/property-registration`

- [ ] 2.2 Create property-registration-form organism
  - [x] 2.2.1 Create organism component in `src/app/ui/organisms/property-registration-form/`
  - [x] 2.2.2 Add property name field (text input)
  - [x] 2.2.3 Add total units/homes field (number input)
  - [x] 2.2.4 Add property type selector (Conjunto/Ciudadela/Condominio)
  - [x] 2.2.5 Remove three-dots menu
  - [x] 2.2.6 Remove location/map picker field
  - [x] 2.2.7 Implement form validation
  - [x] 2.2.8 Add Register Property button
  - [x] 2.2.9 Emit form submission event to parent page

- [x] 2.3 Implement property registration logic
  - [x] 2.3.1 Create or update property service with registration method
  - [x] 2.3.2 Add property model/interface with required fields
  - [x] 2.3.3 Implement save property functionality in page component
  - [x] 2.3.4 Navigate to third screen on successful registration

## 3. Third Screen Implementation
- [x] 3.1 Create third view page component
  - [x] 3.1.1 Create page component in `src/app/pages/admin/[screen-name]/`
  - [x] 3.1.2 Add route configuration
  - [x] 3.1.3 Implement screen UI based on requirements

## 4. Navigation Flow & Guards
- [x] 4.1 Implement navigation guards
  - [x] 4.1.1 Create guard to prevent access to profile-setup if already completed
  - [x] 4.1.2 Create guard to ensure profile is completed before property registration
  - [x] 4.1.3 Add guards to route configuration

- [x] 4.2 Implement post-login redirect logic
  - [x] 4.2.1 Check profile completion status after admin login
  - [x] 4.2.2 Redirect to profile-setup if not completed
  - [x] 4.2.3 Redirect to appropriate dashboard if completed

## 5. Data Models & Services
- [x] 5.1 Update or create admin profile model
  - [x] 5.1.1 Add profileCompleted flag
  - [x] 5.1.2 Add fullName, phoneNumber, adminId fields

- [x] 5.2 Update or create property model
  - [x] 5.2.1 Add propertyName field
  - [x] 5.2.2 Add totalUnits field
  - [x] 5.2.3 Add propertyType enum (Conjunto/Ciudadela/Condominio)

- [x] 5.3 Implement mock services
  - [x] 5.3.1 Add mock data for admin profiles
  - [x] 5.3.2 Add mock data for properties
  - [x] 5.3.3 Implement save methods with mock responses

## 6. Styling & UI Polish
- [x] 6.1 Apply consistent styling across all three screens
  - [x] 6.1.1 Match design system colors and typography
  - [x] 6.1.2 Ensure responsive layout for mobile and desktop
  - [x] 6.1.3 Add loading states for form submissions
  - [x] 6.1.4 Add error handling and user feedback messages
