# Design Document: Fix Register Button Navigation

## Overview

This design changes the behavior of the central "+" button in the bottom navigation bar from navigating to the `/authorization` route to displaying the authorization form as an overlay/modal on the home page. The authorization form component is already designed with `@Input() visible` and `@Output()` event emitters for overlay usage, so this design leverages that existing capability.

The implementation involves:
1. Adding a boolean state property to `HomeComponent` to track overlay visibility
2. Including the `AuthorizationFormComponent` in the home template with conditional rendering
3. Modifying the `onRegisterVisit()` method to toggle the overlay instead of navigating
4. Adding event handlers for form submission and cancellation to close the overlay

## Architecture

The overlay pattern follows Angular's component communication best practices using Input/Output bindings:

**Component Hierarchy:**
```
HomeComponent (Page)
  ├── BottomNavComponent (Organism)
  │     └── Center Button (emits centerAction)
  └── AuthorizationFormComponent (Organism, conditionally rendered)
        ├── formSubmit output event
        └── formCancel output event
```

**State Flow:**
```
User Click → centerAction.emit() → onRegisterVisit() → showFormOverlay = true
                                                      ↓
                                    AuthorizationFormComponent [visible]="true"
                                                      ↓
                                    User Action (submit/cancel)
                                                      ↓
                                    formSubmit/formCancel.emit()
                                                      ↓
                                    onFormClose() → showFormOverlay = false
```

**Key Design Decisions:**

1. **No Routing Changes**: The home page remains the active route; the form appears as an overlay
2. **Reuse Existing Component**: The `AuthorizationFormComponent` already has the necessary inputs/outputs for overlay behavior
3. **Single Source of Truth**: `showFormOverlay` boolean in `HomeComponent` controls visibility
4. **Event-Driven Closure**: Both form submission and cancellation trigger the same close behavior

## Components and Interfaces

### Modified Component: HomeComponent

**Location:** `src/app/pages/home/home.component.ts`

**New State Property:**
```typescript
showFormOverlay: boolean = false;
```

**Modified Method:**
```typescript
onRegisterVisit(): void {
  this.showFormOverlay = true;
}
```

**New Methods:**
```typescript
onFormSubmit(formValue: AuthorizationFormValue): void {
  // Handle form submission (e.g., call service to save data)
  console.log('Form submitted:', formValue);
  this.showFormOverlay = false;
}

onFormCancel(): void {
  this.showFormOverlay = false;
}
```

**Updated Imports:**
```typescript
import { AuthorizationFormComponent } from '../../ui/organisms/authorization-form/authorization-form.component';
import { AuthorizationFormValue } from '../../models/authorization.model';

@Component({
  // ...
  imports: [
    CommonModule, 
    BottomNavComponent, 
    QuickActionCardComponent,
    AuthorizationFormComponent  // Add this
  ],
  // ...
})
```

**Router Service:**
The `Router` service can be removed from the constructor if it's not used elsewhere in the component. If other methods (like `onNoticeBoard()`) will eventually use routing, keep the injection.

### Modified Template: home.component.html

**Location:** `src/app/pages/home/home.component.html`

**Add Authorization Form Overlay:**
Add this element at the end of the template, just before the closing `</div>` of `.home-page`:

```html
<!-- Authorization Form Overlay -->
<app-authorization-form
  [visible]="showFormOverlay"
  (formSubmit)="onFormSubmit($event)"
  (formCancel)="onFormCancel()"
></app-authorization-form>
```

**Positioning:**
The authorization form component should handle its own overlay styling (backdrop, centering, z-index). Based on the component's design with `@Input() visible`, it likely already has CSS for overlay display.

### Unchanged Components

**AuthorizationFormComponent:**
- No changes required
- Already implements `@Input() visible: boolean`
- Already emits `@Output() formSubmit` and `@Output() formCancel`
- Already has overlay styling (assumed based on the visible input pattern)

**BottomNavComponent:**
- No changes required
- Already emits `centerAction` event correctly

## Data Models

**AuthorizationFormValue Interface:**

The interface is already defined in `src/app/models/authorization.model.ts`:

```typescript
export interface AuthorizationFormValue {
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
```

This interface is used for type-safe form submission handling in the `onFormSubmit()` method.

**State Model:**

```typescript
// In HomeComponent
showFormOverlay: boolean = false;  // Controls overlay visibility
```

This is a simple boolean flag with two states:
- `false`: Form overlay is hidden (default state)
- `true`: Form overlay is visible

## Error Handling

**Potential Issues and Mitigations:**

1. **Form Validation Errors:**
   - **Issue:** User submits invalid form data
   - **Mitigation:** The `AuthorizationFormComponent` already handles validation internally and only emits `formSubmit` when the form is valid
   - **Handling:** No additional error handling needed in `HomeComponent`

2. **Missing Component Import:**
   - **Issue:** `AuthorizationFormComponent` not imported in `HomeComponent`
   - **Mitigation:** TypeScript compilation will catch this error
   - **Handling:** Add to imports array in component metadata

3. **Event Handler Not Bound:**
   - **Issue:** Form events not properly bound in template
   - **Mitigation:** Angular template compiler will warn about unbound outputs
   - **Handling:** Ensure proper event binding syntax in template

4. **State Synchronization:**
   - **Issue:** Overlay state gets out of sync with actual visibility
   - **Mitigation:** Use single source of truth (`showFormOverlay`) for all visibility logic
   - **Handling:** Always set `showFormOverlay = false` in both cancel and submit handlers

5. **Form Submission Processing:**
   - **Issue:** Form data needs to be saved/processed after submission
   - **Mitigation:** The `onFormSubmit()` method receives the form data
   - **Handling:** Add service call to persist data (implementation detail for later)

**Error Handling Strategy:**

For this feature, most error handling is already implemented in the `AuthorizationFormComponent`. The `HomeComponent` only needs to:
- Handle the happy path (valid form submission)
- Handle the cancel path (user closes form)
- Optionally log form data for debugging

Future enhancements may include:
- Service integration for data persistence
- Error notifications if submission fails
- Loading states during async operations

## Testing Strategy

### Unit Testing Approach

**HomeComponent Unit Tests:**

Test the state management and event handling logic:

```typescript
describe('HomeComponent - Overlay Behavior', () => {
  let component: HomeComponent;
  
  beforeEach(() => {
    component = new HomeComponent();
  });

  it('should initialize with overlay hidden', () => {
    expect(component.showFormOverlay).toBe(false);
  });

  it('should show overlay when onRegisterVisit is called', () => {
    component.onRegisterVisit();
    expect(component.showFormOverlay).toBe(true);
  });

  it('should hide overlay when onFormCancel is called', () => {
    component.showFormOverlay = true;
    component.onFormCancel();
    expect(component.showFormOverlay).toBe(false);
  });

  it('should hide overlay when onFormSubmit is called', () => {
    component.showFormOverlay = true;
    const mockFormValue: AuthorizationFormValue = {
      firstName: 'John',
      lastName: 'Doe',
      idDocument: 'ABC123',
      entryType: 'visitor',
      hasVehicle: false,
      validityPeriod: 60
    };
    component.onFormSubmit(mockFormValue);
    expect(component.showFormOverlay).toBe(false);
  });
});
```

**Integration Tests:**

Test the interaction between components:

```typescript
describe('HomeComponent - Form Overlay Integration', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should render authorization form when overlay is shown', () => {
    component.showFormOverlay = true;
    fixture.detectChanges();
    
    const formElement = compiled.querySelector('app-authorization-form');
    expect(formElement).toBeTruthy();
  });

  it('should pass visible input to authorization form', () => {
    component.showFormOverlay = true;
    fixture.detectChanges();
    
    const formComponent = fixture.debugElement.query(
      By.directive(AuthorizationFormComponent)
    ).componentInstance;
    
    expect(formComponent.visible).toBe(true);
  });

  it('should hide overlay when form emits cancel event', () => {
    component.showFormOverlay = true;
    fixture.detectChanges();
    
    const formComponent = fixture.debugElement.query(
      By.directive(AuthorizationFormComponent)
    ).componentInstance;
    
    formComponent.formCancel.emit();
    fixture.detectChanges();
    
    expect(component.showFormOverlay).toBe(false);
  });
});
```

### Manual Testing Checklist

1. **Show Overlay:**
   - Navigate to home page
   - Click the "+" button in bottom navigation
   - Verify authorization form appears as overlay
   - Verify home page content is still visible underneath
   - Verify backdrop is displayed

2. **Close via Cancel:**
   - Open the overlay
   - Click cancel/close button in form
   - Verify overlay closes
   - Verify home page is fully visible

3. **Close via Submit:**
   - Open the overlay
   - Fill out form with valid data
   - Click submit button
   - Verify overlay closes
   - Verify form data is logged to console

4. **Multiple Opens:**
   - Open and close overlay multiple times
   - Verify behavior is consistent
   - Verify no memory leaks or state issues

5. **Quick Action Card:**
   - Click "Register Visit" quick action card
   - Verify overlay opens (same behavior as bottom nav button)

### Testing Configuration

- **Framework:** Jasmine 5.2 with Karma 6.4 (already configured)
- **Test Location:** `src/app/pages/home/home.component.spec.ts`
- **Coverage Target:** 100% for new methods (`onFormSubmit`, `onFormCancel`, modified `onRegisterVisit`)
- **Integration Tests:** Use Angular's TestBed for component interaction testing


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Analysis

After analyzing the acceptance criteria, this feature involves specific UI state management and component interactions rather than universal properties that apply across a range of inputs. The testable requirements are best validated through concrete unit test examples that verify the state transitions and event handling.

### Testable Examples

**Example 1: Show Overlay on Button Click**
When the `onRegisterVisit()` method is called, the `showFormOverlay` state should be set to `true`.
**Validates: Requirements 1.1, 2.2**

**Example 2: Overlay Visibility Binding**
When `showFormOverlay` is `true`, the `AuthorizationFormComponent` should receive `visible` input as `true`. When `showFormOverlay` is `false`, the component should receive `visible` as `false`.
**Validates: Requirements 2.3, 2.4**

**Example 3: Hide Overlay on Cancel**
When the `onFormCancel()` method is called, the `showFormOverlay` state should be set to `false`.
**Validates: Requirements 3.2**

**Example 4: Hide Overlay on Submit**
When the `onFormSubmit()` method is called with valid form data, the `showFormOverlay` state should be set to `false`.
**Validates: Requirements 4.2**

**Example 5: No Navigation Occurs**
When the `onRegisterVisit()` method is called, the `router.navigate()` method should NOT be invoked.
**Validates: Requirements 1.3, 6.1**

**Example 6: Template Includes Form Component**
The `HomeComponent` template should include the `app-authorization-form` element with proper input and output bindings.
**Validates: Requirements 5.1**

### Why No Property-Based Tests?

This feature does not require property-based testing because:

1. **State Machine with Fixed States**: The overlay has only two states (visible/hidden), not a range of values to test
2. **Specific UI Interactions**: The behavior is tied to specific button clicks and event handlers, not general patterns
3. **No Input Variation**: The state transitions are deterministic and don't involve variable inputs that would benefit from randomized testing
4. **Component Integration**: The feature tests component communication patterns (Input/Output bindings) which are best verified with concrete examples

Property-based testing is most valuable for:
- Functions that accept a wide range of inputs
- Algorithms with invariants that should hold for all inputs
- Data transformations with round-trip properties
- Parsers and serializers

This feature involves simple boolean state management and event handling, making concrete example-based unit tests the appropriate testing strategy. Each test verifies a specific state transition or binding behavior that should work consistently.

### Testing Approach

**Unit Tests** will verify:
- State initialization (default to `false`)
- State transitions on method calls
- Event handler behavior
- No navigation side effects

**Integration Tests** will verify:
- Component rendering based on state
- Input/Output bindings between parent and child
- Event propagation from child to parent
- DOM updates reflecting state changes

Both testing approaches use concrete examples to verify the specific behaviors defined in the requirements, ensuring the overlay functionality works correctly in all scenarios.
