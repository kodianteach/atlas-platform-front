# Design Document: Access Permissions Management

## Overview

El módulo Access Permissions Management proporciona una interfaz para gestionar autorizaciones de acceso en la aplicación Atlas Platform. El diseño sigue la arquitectura Atomic Design de Angular 18 con componentes standalone, permitiendo la composición de una página completa a partir de componentes reutilizables.

La página principal (`AccessPermissionsComponent`) orquesta la visualización de autorizaciones existentes y proporciona navegación hacia la creación de nuevas autorizaciones. El diseño prioriza la usabilidad, accesibilidad y la separación de responsabilidades entre componentes presentacionales y lógica de negocio.

## Architecture

### Component Hierarchy

```
AccessPermissionsPage (Page)
├── PageHeaderOrganism
│   ├── BackButtonAtom
│   ├── PageTitleAtom
│   └── HistoryButtonAtom
├── GrantAuthorizationCardOrganism
│   ├── IconAtom
│   ├── CardTitleMolecule
│   └── ButtonAtom
└── AuthorizationListOrganism
    ├── ListHeaderMolecule
    │   ├── TitleAtom
    │   └── CountBadgeAtom
    └── AuthorizationItemMolecule (repeated)
        ├── IconAtom
        ├── AuthorizationInfoMolecule
        │   ├── NameTextAtom
        │   └── DetailsTextAtom
        └── ToggleSwitchAtom
```

### Routing Integration

La página se integra en el sistema de rutas de Angular mediante lazy loading:

```typescript
{
  path: 'access-permissions',
  loadComponent: () => import('./pages/access-permissions/access-permissions.component')
    .then(m => m.AccessPermissionsComponent)
}
```

La navegación desde el Bottom Navigation se maneja mediante el Router de Angular cuando el usuario hace clic en el botón "Manage".

### State Management

El estado de las autorizaciones se gestiona a nivel de página mediante:
- Un servicio `AuthorizationService` que maneja la persistencia y recuperación de datos
- Estado local en el componente de página para la lista de autorizaciones
- Observables de RxJS para manejar cambios asíncronos

## Components and Interfaces

### New Components to Create

#### 1. AccessPermissionsComponent (Page)
**Location:** `src/app/pages/access-permissions/`
**Type:** Page-level orchestrator
**Responsibilities:**
- Fetch authorization data from AuthorizationService
- Handle navigation events
- Manage authorization toggle state changes
- Compose organisms and pass data via @Input()

**Interface:**
```typescript
interface Authorization {
  id: string;
  name: string;
  type: 'permanent' | 'scheduled';
  isActive: boolean;
  icon: string;
  details: AuthorizationDetails;
}

interface AuthorizationDetails {
  accessType?: string;
  permissions?: string;
  schedule?: {
    days: string[];
    timeRange: string;
  };
}
```

#### 2. PageHeaderOrganism
**Location:** `src/app/ui/organisms/page-header/`
**Type:** Organism (reusable header)
**Responsibilities:**
- Display page title
- Provide back navigation button
- Provide action buttons (history, etc.)

**Inputs:**
- `title: string` - Page title text
- `showBackButton: boolean` - Whether to show back button
- `showHistoryButton: boolean` - Whether to show history button

**Outputs:**
- `backClick: EventEmitter<void>` - Emitted when back button clicked
- `historyClick: EventEmitter<void>` - Emitted when history button clicked

#### 3. GrantAuthorizationCardOrganism
**Location:** `src/app/ui/organisms/grant-authorization-card/`
**Type:** Organism
**Responsibilities:**
- Display prominent call-to-action for creating new authorizations
- Emit event when user wants to create new authorization

**Inputs:**
- `title: string` - Card title
- `description: string` - Card description text
- `icon: string` - Icon identifier

**Outputs:**
- `createClick: EventEmitter<void>` - Emitted when create button clicked

#### 4. AuthorizationListOrganism
**Location:** `src/app/ui/organisms/authorization-list/`
**Type:** Organism
**Responsibilities:**
- Display list of authorizations with header
- Handle empty state
- Emit toggle events for individual authorizations

**Inputs:**
- `authorizations: Authorization[]` - Array of authorization objects
- `activeCount: number` - Count of active authorizations

**Outputs:**
- `toggleAuthorization: EventEmitter<string>` - Emitted with authorization ID when toggle clicked

#### 5. AuthorizationItemMolecule
**Location:** `src/app/ui/molecules/authorization-item/`
**Type:** Molecule
**Responsibilities:**
- Display single authorization with all details
- Show toggle switch for activation status

**Inputs:**
- `authorization: Authorization` - Authorization object
- `isActive: boolean` - Current active state

**Outputs:**
- `toggle: EventEmitter<void>` - Emitted when toggle switch clicked

#### 6. ToggleSwitchAtom
**Location:** `src/app/ui/atoms/toggle-switch/`
**Type:** Atom
**Responsibilities:**
- Render accessible toggle switch
- Emit change events

**Inputs:**
- `checked: boolean` - Current checked state
- `disabled: boolean` - Whether switch is disabled
- `ariaLabel: string` - Accessibility label

**Outputs:**
- `change: EventEmitter<boolean>` - Emitted when switch state changes

### Existing Components to Reuse

- **ButtonAtom** (`src/app/ui/atoms/button/`) - For "Create New Pass" button and navigation buttons
- **IconAtom** (`src/app/ui/atoms/icon/`) - For all icon displays
- **BadgeAtom** (`src/app/ui/atoms/badge/`) - For active count badge

### Services

#### AuthorizationService
**Location:** `src/app/services/authorization.service.ts`
**Responsibilities:**
- Fetch authorizations from backend/storage
- Update authorization status
- Persist changes
- Provide Observable streams for authorization data

**Methods:**
```typescript
getAuthorizations(): Observable<Authorization[]>
toggleAuthorizationStatus(id: string): Observable<Authorization>
getActiveCount(): Observable<number>
```

## Data Models

### Authorization Model

```typescript
interface Authorization {
  id: string;                    // Unique identifier
  name: string;                  // Display name (e.g., "Family Member")
  type: 'permanent' | 'scheduled'; // Access type
  isActive: boolean;             // Current activation status
  icon: string;                  // Icon identifier for display
  details: AuthorizationDetails; // Type-specific details
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last modification timestamp
}

interface AuthorizationDetails {
  accessType?: string;           // e.g., "Permanent Access"
  permissions?: string;          // e.g., "Full Permissions"
  schedule?: ScheduleDetails;    // Only for scheduled type
}

interface ScheduleDetails {
  days: string[];                // e.g., ["Mon", "Wed", "Fri"]
  timeRange: string;             // e.g., "09:00 AM - 02:00 PM"
}
```

### Component State Models

```typescript
// Page component state
interface AccessPermissionsState {
  authorizations: Authorization[];
  isLoading: boolean;
  error: string | null;
}

// List organism state
interface AuthorizationListState {
  items: Authorization[];
  activeCount: number;
  isEmpty: boolean;
}
```


## Correctness Properties

*Una propiedad es una característica o comportamiento que debe mantenerse verdadero en todas las ejecuciones válidas del sistema - esencialmente, una declaración formal sobre lo que el sistema debe hacer. Las propiedades sirven como puente entre las especificaciones legibles por humanos y las garantías de corrección verificables por máquinas.*

### Property 1: Navigation Button Behavior
*Para cualquier* botón de navegación en la página (Manage, Back, History, Create New Pass), hacer clic en el botón debe resultar en una navegación a la ruta correcta correspondiente.
**Validates: Requirements 1.1, 1.3, 2.4, 6.2**

### Property 2: Authorization List Rendering
*Para cualquier* conjunto de autorizaciones proporcionado a la lista, cada autorización debe renderizarse como un elemento de lista con toda su información completa.
**Validates: Requirements 3.4**

### Property 3: Authorization Display Completeness
*Para cualquier* autorización individual renderizada, el elemento debe contener un icono identificador, el nombre de la autorización, y un toggle switch.
**Validates: Requirements 4.1, 4.2, 4.5**

### Property 4: Permanent Access Display Format
*Para cualquier* autorización de tipo "permanent", los detalles mostrados deben incluir el texto "Permanent Access" y "Full Permissions".
**Validates: Requirements 4.3**

### Property 5: Scheduled Access Display Format
*Para cualquier* autorización de tipo "scheduled", los detalles mostrados deben incluir los días de la semana y el rango de tiempo del schedule.
**Validates: Requirements 4.4**

### Property 6: Toggle State Transition
*Para cualquier* autorización, hacer clic en el toggle switch debe cambiar el estado isActive al valor opuesto (true → false, false → true).
**Validates: Requirements 5.1, 5.2**

### Property 7: Toggle Persistence
*Para cualquier* cambio de estado de autorización, el servicio debe ser llamado para persistir el nuevo estado inmediatamente.
**Validates: Requirements 5.3**

### Property 8: Active Count Update
*Para cualquier* cambio de estado de autorización, el contador de autorizaciones activas debe actualizarse para reflejar el nuevo total de autorizaciones con isActive === true.
**Validates: Requirements 5.4**

### Property 9: Interactive Elements Accessibility
*Para cualquier* elemento interactivo en la página (botones, toggles, links), debe tener un atributo aria-label o aria-labelledby definido.
**Validates: Requirements 8.1**

### Property 10: Keyboard Navigation Support
*Para cualquier* elemento interactivo en la página, debe ser focusable mediante navegación por teclado (tabindex apropiado) y activable mediante Enter o Space.
**Validates: Requirements 8.2**

### Property 11: Focus Indicator Visibility
*Para cualquier* elemento interactivo cuando recibe focus, debe tener estilos CSS que proporcionen un indicador visual de focus.
**Validates: Requirements 8.3**

### Property 12: Logical Tab Order
*Para cualquier* secuencia de elementos interactivos en la página, el orden de tabulación debe seguir el orden visual de arriba hacia abajo y de izquierda a derecha.
**Validates: Requirements 8.4**

### Property 13: ARIA Roles for Structures
*Para cualquier* estructura de lista de autorizaciones, debe tener el role="list" y cada item debe tener role="listitem". Para cualquier toggle switch, debe tener role="switch".
**Validates: Requirements 8.5**

## Error Handling

### Navigation Errors
- **Scenario**: Router navigation fails
- **Handling**: Display error toast notification and log error to console
- **Recovery**: Allow user to retry navigation action

### Service Errors
- **Scenario**: AuthorizationService fails to fetch data
- **Handling**: Display error state in the list organism with retry button
- **Recovery**: Provide "Retry" action that re-attempts the service call

- **Scenario**: Toggle status update fails
- **Handling**: Revert toggle switch to previous state and show error toast
- **Recovery**: Allow user to retry toggle action

### Empty States
- **Scenario**: No authorizations exist
- **Handling**: Display empty state message with call-to-action to create first authorization
- **User Action**: Click "Create New Pass" to add first authorization

### Loading States
- **Scenario**: Data is being fetched
- **Handling**: Display loading skeleton or spinner in list area
- **User Experience**: Prevent interaction with list during loading

## Testing Strategy

### Unit Testing Approach

Unit tests will verify specific examples, edge cases, and error conditions using Jasmine/Karma:

**Component Tests:**
- Page header renders with correct title (example test)
- Grant authorization card displays all required elements (example test)
- Empty state displays when authorization list is empty (edge case test)
- Error state displays when service fails (error condition test)
- Loading state displays during data fetch (example test)

**Service Tests:**
- AuthorizationService.getAuthorizations() returns expected data structure
- AuthorizationService.toggleAuthorizationStatus() calls correct API endpoint
- Service handles HTTP errors appropriately

**Integration Tests:**
- Page component correctly integrates with AuthorizationService
- Navigation events trigger correct router calls
- Toggle events propagate from child components to service

### Property-Based Testing Approach

Property tests will verify universal properties across all inputs using a property-based testing library (fast-check for TypeScript/Angular):

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: access-permissions-management, Property {number}: {property_text}**

**Property Test Coverage:**
- Property 1: Navigation behavior for all navigation buttons
- Property 2: List rendering for any array of authorizations
- Property 3: Authorization display completeness for any authorization object
- Property 4: Permanent access format for any permanent authorization
- Property 5: Scheduled access format for any scheduled authorization
- Property 6: Toggle state transitions for any authorization
- Property 7: Persistence calls for any status change
- Property 8: Count updates for any status change
- Property 9: ARIA labels for all interactive elements
- Property 10: Keyboard navigation for all interactive elements
- Property 11: Focus indicators for all interactive elements
- Property 12: Tab order for any set of interactive elements
- Property 13: ARIA roles for list structures and toggles

**Test Data Generators:**
Create generators in `src/app/testing/generators.ts`:
- `generateAuthorization()`: Random valid authorization objects
- `generateAuthorizationList()`: Random arrays of authorizations
- `generateSchedule()`: Random valid schedule configurations

### Testing Balance

- Unit tests focus on specific examples and edge cases (empty states, error conditions)
- Property tests handle comprehensive input coverage through randomization
- Together they provide complete validation: unit tests catch concrete bugs, property tests verify general correctness
- Avoid writing too many unit tests for scenarios already covered by property tests
