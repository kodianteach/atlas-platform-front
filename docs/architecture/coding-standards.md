# Atlas Platform (Frontend) - Estándares de Código 📝

## 📋 **Información General**

### Propósito del Documento

Este documento define los estándares de código obligatorios y recomendados para el desarrollo en **Atlas Platform**, la aplicación frontend Angular del ecosistema Atlas. Estos estándares garantizan consistencia, legibilidad y mantenibilidad del código.

**Audiencia**: Desarrolladores Frontend, Code Reviewers, Tech Leads  
**Última Actualización**: 2025-07-15  
**Estado**: Activo

### Stack Tecnológico

| Tecnología       | Versión | Propósito                      |
| ---------------- | ------- | ------------------------------ |
| Angular          | 18.2    | Framework principal            |
| TypeScript       | 5.5     | Lenguaje (modo estricto)       |
| RxJS             | 7.8     | Programación reactiva          |
| Bootstrap        | 5.3.8   | Framework CSS                  |
| Jasmine          | 5.2     | Framework de testing           |
| Karma            | 6.4     | Test runner                    |
| fast-check       | 3.x     | Property-based testing         |
| Zone.js          | 0.14    | Change detection               |
| Service Worker   | 18.2    | PWA / Offline support          |

---

## 🚨 **Estándares Obligatorios**

### 1. Nomenclatura

#### Variables y Funciones

```typescript
// ✅ CORRECTO — camelCase, nombres descriptivos
const authorizationRecords = signal<AuthorizationRecord[]>([]);
const isAuthenticated$ = new BehaviorSubject<boolean>(false);
function calculateValidityEnd(startDate: Date, minutes: number): Date { ... }
function formatTimeAgo(date: Date): string { ... }

// ❌ INCORRECTO — abreviaciones, nombres ambiguos
const auth = [];
const flag = false;
function calc(d: Date, m: number) { ... }
```

**Reglas:**
- Variables y funciones en **camelCase**
- Observables con sufijo `$`: `user$`, `isAuthenticated$`, `permissions$`
- BehaviorSubjects privados con prefijo `_` y sufijo `$`: `private _currentUser$ = new BehaviorSubject<User | null>(null)`
- Signals sin sufijo especial: `records`, `filteredRecords`, `isLoading`
- Booleanos con prefijo semántico: `isLoading`, `hasVehicle`, `canActivate`
- Funciones de tipo guard con prefijo `is`: `isVisitorEntry()`, `isPollAnnouncement()`

#### Componentes y Servicios

```typescript
// ✅ CORRECTO — PascalCase con sufijo descriptivo
@Component({ selector: 'app-authorization-form' })
export class AuthorizationFormComponent { ... }

@Injectable({ providedIn: 'root' })
export class AuthorizationService { ... }

// ❌ INCORRECTO
@Component({ selector: 'authForm' })
export class AuthForm { ... }

export class Authorization { ... } // Sin sufijo Service
```

**Reglas:**
- Componentes: `PascalCase` + sufijo `Component` → `AuthorizationFormComponent`
- Servicios: `PascalCase` + sufijo `Service` → `AuthenticationService`
- Guards: función exportada con sufijo `Guard` → `profileCompletionGuard`
- Interceptors: función exportada con nombre descriptivo → `mockApiInterceptor`
- Modelos/Interfaces: `PascalCase` sin prefijo `I` → `AuthorizationRecord`, `AnnouncementBase`
- Type Aliases: `PascalCase` → `AnnouncementType`, `EntryType`

#### Selectores de Componentes

```typescript
// ✅ CORRECTO — prefijo 'app-', kebab-case
selector: 'app-button'
selector: 'app-authorization-list-item'
selector: 'app-login-template'

// ❌ INCORRECTO
selector: 'button'              // Sin prefijo
selector: 'appButton'           // camelCase
selector: 'app_auth_form'       // snake_case
```

#### Archivos y Directorios

```bash
# ✅ CORRECTO — kebab-case, sufijo por tipo
src/app/
├── ui/
│   ├── atoms/
│   │   └── button/
│   │       ├── button.component.ts
│   │       ├── button.component.html
│   │       ├── button.component.css
│   │       └── button.component.spec.ts
│   ├── molecules/
│   │   └── authorization-list-item/
│   │       ├── authorization-list-item.component.ts
│   │       └── ...
│   ├── organisms/
│   │   └── authorization-form/
│   │       ├── authorization-form.component.ts
│   │       └── ...
│   └── templates/
│       └── login-template/
│           ├── login-template.component.ts
│           └── ...
├── pages/
│   └── authorization/
│       ├── authorization.component.ts
│       └── ...
├── services/
│   ├── authorization.service.ts
│   └── mock/
│       ├── auth-mock.service.ts
│       ├── types/
│       │   └── api-response.interface.ts
│       └── utils/
│           └── response-builder.ts
├── models/
│   └── authorization.model.ts
├── guards/
│   └── profile-completion.guard.ts
├── interceptors/
│   └── mock-api.interceptor.ts
└── testing/
    ├── generators.ts
    └── generators.spec.ts

# ❌ INCORRECTO
src/app/
├── components/
│   └── AuthorizationForm.ts       # PascalCase en archivos
├── authService.ts                  # camelCase, sin carpeta
└── auth.model.ts                   # Abreviación
```

**Convención de sufijos de archivos:**

| Tipo          | Sufijo                    | Ejemplo                              |
| ------------- | ------------------------- | ------------------------------------ |
| Componente    | `.component.ts`           | `button.component.ts`                |
| Servicio      | `.service.ts`             | `authorization.service.ts`           |
| Mock Service  | `-mock.service.ts`        | `auth-mock.service.ts`               |
| Guard         | `.guard.ts`               | `profile-completion.guard.ts`        |
| Interceptor   | `.interceptor.ts`         | `mock-api.interceptor.ts`            |
| Modelo        | `.model.ts`               | `authorization.model.ts`             |
| Interface     | `.interface.ts`           | `api-response.interface.ts`          |
| Test          | `.spec.ts`                | `button.component.spec.ts`           |
| Generadores   | `generators.ts`           | `generators.ts`                      |
| Utilidades    | diversos                  | `response-builder.ts`                |

---

### 2. Arquitectura: Atomic Design

El proyecto sigue el patrón **Atomic Design** para organizar componentes UI. Es **obligatorio** respetar la jerarquía y responsabilidades de cada nivel.

#### Jerarquía de Componentes

```
Atoms → Molecules → Organisms → Templates → Pages
  ↑         ↑            ↑           ↑          ↑
  │         │            │           │          │
 Más       Composición  Lógica de   Layout    Ruteado,
 simple    de atoms     negocio UI  completo  datos, estado
```

| Nivel        | Responsabilidad                                     | Puede importar            | Ejemplo                         |
| ------------ | --------------------------------------------------- | ------------------------- | ------------------------------- |
| **Atoms**    | Elemento UI mínimo, puramente presentacional         | Nada (solo Angular core)  | `ButtonComponent`, `InputComponent` |
| **Molecules**| Composición de atoms con lógica de formato mínima    | Atoms                     | `AuthorizationListItemComponent`    |
| **Organisms**| Secciones con lógica de negocio UI (formularios)     | Atoms, Molecules          | `AuthorizationFormComponent`        |
| **Templates**| Layouts con content projection, sin lógica           | Atoms, Molecules, Organisms| `LoginTemplateComponent`           |
| **Pages**    | Componentes ruteados, orquestan datos y estado       | Todos los niveles + Services | `AuthorizationComponent`        |

#### Atoms — Reglas

```typescript
// ✅ CORRECTO — Atom: solo @Input/@Output, sin lógica de negocio
@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [class]="'btn btn-' + variant + ' btn-' + size"
      [disabled]="disabled"
      [type]="type"
      (click)="onClick.emit($event)">
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Output() onClick = new EventEmitter<Event>();
}

// ❌ INCORRECTO — Atom con inyección de servicio o lógica
export class ButtonComponent {
  constructor(private authService: AuthService) {} // NO en atoms
}
```

#### Pages — Reglas

```typescript
// ✅ CORRECTO — Page: orquesta servicios, maneja estado
@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [CommonModule, AuthorizationFormComponent, AuthorizationListComponent],
  templateUrl: './authorization.component.html'
})
export class AuthorizationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  records: AuthorizationRecord[] = [];
  filteredRecords: AuthorizationRecord[] = [];

  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRecords(): void {
    this.authorizationService.getRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe(records => {
        this.records = records;
        this.filteredRecords = records;
      });
  }
}
```

---

### 3. Componentes Standalone

**Todos** los componentes, directivas y pipes deben ser `standalone: true`. No se permite el uso de NgModules.

```typescript
// ✅ CORRECTO — Standalone component
@Component({
  selector: 'app-authorization-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './authorization-form.component.html',
  styleUrls: ['./authorization-form.component.css']
})
export class AuthorizationFormComponent { ... }

// ❌ INCORRECTO — NgModule
@NgModule({
  declarations: [AuthorizationFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [AuthorizationFormComponent]
})
export class AuthorizationModule {} // PROHIBIDO
```

**Reglas de imports en standalone components:**
- Importar **solo** lo que el template necesita directamente
- Preferir imports específicos sobre módulos completos cuando sea posible
- Orden de imports en el array `imports`:
  1. Módulos Angular (`CommonModule`, `ReactiveFormsModule`)
  2. Módulos de terceros (`RouterModule`)
  3. Componentes internos (Atoms → Molecules → Organisms)

---

### 4. Organización de Imports en TypeScript

```typescript
// ✅ CORRECTO — Orden de imports
// 1. Angular core y plataforma
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// 2. Angular HTTP, Router, etc.
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

// 3. RxJS
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, map, catchError, timeout, retry } from 'rxjs/operators';

// 4. Librerías de terceros
import * as fc from 'fast-check';

// 5. Modelos / Interfaces
import { AuthorizationRecord, AuthorizationFormValue } from '../models/authorization.model';

// 6. Servicios
import { AuthorizationService } from '../services/authorization.service';

// 7. Componentes internos (UI)
import { ButtonComponent } from '../ui/atoms/button/button.component';
import { AuthorizationListItemComponent } from '../ui/molecules/authorization-list-item/authorization-list-item.component';

// ❌ INCORRECTO — Imports desordenados y mezclados
import { ButtonComponent } from '../ui/atoms/button/button.component';
import { Component } from '@angular/core';
import { AuthorizationService } from '../services/authorization.service';
import { Subject } from 'rxjs';
```

---

### 5. Modelos y Tipado

#### Interfaces con Documentación JSDoc

```typescript
// ✅ CORRECTO — JSDoc con trazabilidad de requisitos
/**
 * Represents an authorization record for visitor/courier entry.
 * @requirement REQ-AUTH-001 - Authorization data structure
 */
export interface AuthorizationRecord {
  /** Unique identifier */
  id: string;
  /** Full name of the person being authorized */
  firstName: string;
  lastName: string;
  /** Government-issued identification document */
  idDocument: string;
  /** Type of entry being authorized */
  entryType: 'visitor' | 'courier';
  /** Whether the person has a vehicle */
  hasVehicle: boolean;
  /** License plate if hasVehicle is true */
  licensePlate?: string;
  /** Authorization validity period in minutes */
  validityPeriod: number;
  /** ISO timestamp of authorization creation */
  createdAt: string;
  /** Current status of the authorization */
  status: 'active' | 'expired' | 'revoked';
}
```

#### Tipos Discriminados (Discriminated Unions)

```typescript
// ✅ CORRECTO — Discriminated union con type guards
export interface BroadcastAnnouncement extends AnnouncementBase {
  type: 'broadcast';
  priority: 'high' | 'medium' | 'low';
}

export interface PollAnnouncement extends AnnouncementBase {
  type: 'poll';
  options: PollOption[];
  allowMultipleVotes: boolean;
}

export type Announcement = BroadcastAnnouncement | PollAnnouncement;

// Type guard obligatorio para cada discriminated union
export function isPollAnnouncement(a: Announcement): a is PollAnnouncement {
  return a.type === 'poll';
}

export function isBroadcastAnnouncement(a: Announcement): a is BroadcastAnnouncement {
  return a.type === 'broadcast';
}

// ❌ INCORRECTO — Tipo genérico sin discriminación
export interface Announcement {
  type: string;       // string genérico en vez de literal
  options?: any[];    // campos opcionales ambiguos
}
```

#### Reglas de Tipado TypeScript Estricto

```typescript
// ✅ CORRECTO
const records: AuthorizationRecord[] = [];
function getUser(id: string): Observable<User | null> { ... }

// ❌ INCORRECTO — any, tipos implícitos
const records: any[] = [];                    // NUNCA usar any
function getUser(id) { ... }                  // Parámetro sin tipo
const data = response as any;                 // Cast a any
```

**Reglas obligatorias (habilitadas en tsconfig.json):**
- `strict: true` — Modo estricto completo
- `noImplicitAny: true` — Prohibido `any` implícito
- `strictNullChecks: true` — Nulabilidad explícita
- `noUnusedLocals: false` — Permitido (por desarrollo iterativo)
- `noUnusedParameters: false` — Permitido
- `noFallthroughCasesInSwitch: true` — Switch exhaustivo

---

### 6. Patrones RxJS y Gestión de Estado

#### Gestión de Estado con BehaviorSubject

```typescript
// ✅ CORRECTO — Patrón estándar de estado en servicios
@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  // BehaviorSubject privado (fuente de verdad)
  private _permissions$ = new BehaviorSubject<string[]>([]);

  // Observable público (solo lectura)
  readonly permissions$ = this._permissions$.asObservable();

  // Método para actualizar el estado
  updatePermissions(permissions: string[]): void {
    this._permissions$.next(permissions);
  }

  // Selector derivado con pipe
  hasPermission(permission: string): Observable<boolean> {
    return this.permissions$.pipe(
      map(perms => perms.includes(permission))
    );
  }
}

// ❌ INCORRECTO — BehaviorSubject público
export class AuthorizationService {
  permissions$ = new BehaviorSubject<string[]>([]); // NO exponer directamente
}
```

#### Limpieza de Subscripciones (destroy$)

```typescript
// ✅ CORRECTO — Patrón destroy$ obligatorio en componentes con subscripciones
export class AuthorizationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.authService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(permissions => {
        this.permissions = permissions;
      });

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.loadData(params['id']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ❌ INCORRECTO — Subscripción sin cleanup
export class BadComponent implements OnInit {
  ngOnInit(): void {
    this.service.data$.subscribe(data => { ... }); // MEMORY LEAK
  }
}
```

**Alternativa aceptable: Subscription manual**

```typescript
// ✅ ACEPTABLE — Para casos simples (máximo 2- subscripciones)
export class HomeComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.service.data$.subscribe(data => { ... })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
```

#### Operadores RxJS en Servicios HTTP

```typescript
// ✅ CORRECTO — Patrón de servicio HTTP con error handling
login(username: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
    .pipe(
      timeout(10000),                         // Timeout obligatorio
      retry(1),                               // Reintentos controlados
      catchError(error => {                   // Manejo de errores
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
}

// ❌ INCORRECTO — Sin timeout ni manejo de errores
login(username: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password });
}
```

---

### 7. Manejo de Errores

#### En Servicios

```typescript
// ✅ CORRECTO — catchError con logging y re-throw tipado
getAnnouncements(): Observable<Announcement[]> {
  return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`)
    .pipe(
      catchError(error => {
        console.error('Error fetching announcements:', error);
        return throwError(() => new Error('Failed to load announcements'));
      })
    );
}
```

#### En Componentes

```typescript
// ✅ CORRECTO — Manejo de error en subscripción con feedback al usuario
this.authService.login(credentials)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (response) => {
      this.router.navigate(['/home']);
    },
    error: (error) => {
      this.errorMessage = 'Credenciales inválidas. Intente nuevamente.';
      this.isLoading = false;
    }
  });

// ❌ INCORRECTO — Solo next callback
this.authService.login(credentials).subscribe(response => {
  this.router.navigate(['/home']);
}); // Sin manejo de errores
```

---

### 8. Comentarios y Documentación

#### JSDoc Obligatorio

```typescript
// ✅ CORRECTO — JSDoc en servicios públicos con trazabilidad
/**
 * Fetches all announcements for the current property.
 * Announcements can be broadcasts or polls.
 *
 * @requirement REQ-ANN-001 - Load announcements list
 * @returns Observable of announcements array
 */
getAnnouncements(): Observable<Announcement[]> { ... }

/**
 * Creates a new authorization entry for a visitor or courier.
 *
 * @requirement REQ-AUTH-003 - Create authorization
 * @param formValue - The authorization form data
 * @returns Observable of the created authorization record
 */
createAuthorization(formValue: AuthorizationFormValue): Observable<AuthorizationRecord> { ... }
```

**Reglas:**
- **Obligatorio**: JSDoc en todos los métodos públicos de servicios
- **Obligatorio**: JSDoc en todas las interfaces y sus propiedades
- **Recomendado**: `@requirement` tag para trazabilidad con requisitos
- **Recomendado**: Comentarios inline para lógica compleja
- **Prohibido**: Comentarios obvios (`// increment counter` antes de `counter++`)

---

### 9. Guards e Interceptors Funcionales

```typescript
// ✅ CORRECTO — Guard funcional (Angular 18+)
export const profileCompletionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isProfileComplete()) {
    return true;
  }

  return router.createUrlTree(['/profile-setup']);
};

// ❌ INCORRECTO — Guard basado en clase (legacy)
@Injectable({ providedIn: 'root' })
export class ProfileCompletionGuard implements CanActivate {
  canActivate(): boolean { ... }
}
```

```typescript
// ✅ CORRECTO — Interceptor funcional
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const mockService = inject(MockAuthService);

  if (req.url.includes('/api/auth')) {
    return mockService.handleRequest(req);
  }

  return next(req);
};

// ❌ INCORRECTO — Interceptor basado en clase (legacy)
@Injectable()
export class MockApiInterceptor implements HttpInterceptor { ... }
```

---

### 10. Rutas y Lazy Loading

```typescript
// ✅ CORRECTO — Lazy loading con loadComponent para standalone
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login-page.component')
      .then(m => m.LoginPageComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent),
    canActivate: [profileCompletionGuard]
  },
  {
    path: 'authorization',
    loadComponent: () => import('./pages/authorization/authorization.component')
      .then(m => m.AuthorizationComponent),
    canActivate: [profileCompletionGuard]
  }
];

// ❌ INCORRECTO — Import directo (no lazy)
import { HomeComponent } from './pages/home/home.component';
{ path: 'home', component: HomeComponent } // No lazy loaded
```

---

## 💡 **Convenciones Recomendadas**

### 1. Patrón de Formularios Reactivos

```typescript
// ✅ RECOMENDADO — FormBuilder con validaciones tipadas
export class AuthorizationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  authorizationForm!: FormGroup;

  ngOnInit(): void {
    this.authorizationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      idDocument: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{5,20}$/)]],
      entryType: ['visitor', Validators.required],
      hasVehicle: [false],
      licensePlate: [''],
      validityPeriod: [60, Validators.required]
    });
  }

  // Validación condicional
  onHasVehicleChange(): void {
    const licensePlateControl = this.authorizationForm.get('licensePlate');
    if (this.authorizationForm.get('hasVehicle')?.value) {
      licensePlateControl?.setValidators([Validators.required]);
    } else {
      licensePlateControl?.clearValidators();
    }
    licensePlateControl?.updateValueAndValidity();
  }
}
```

### 2. Content Projection en Templates

```typescript
// ✅ RECOMENDADO — Template con content projection
@Component({
  selector: 'app-login-template',
  standalone: true,
  template: `
    <div class="login-layout">
      <header class="login-header">
        <ng-content select="[header]" />
      </header>
      <main class="login-content">
        <ng-content />
      </main>
      <footer class="login-footer">
        <ng-content select="[footer]" />
      </footer>
    </div>
  `
})
export class LoginTemplateComponent {}

// Uso:
// <app-login-template>
//   <div header>Logo</div>
//   <app-login-form />
//   <div footer>© 2025</div>
// </app-login-template>
```

### 3. Mock Services con ApiResponse\<T\>

```typescript
// ✅ RECOMENDADO — Interfaz estándar de respuesta mock
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// ✅ RECOMENDADO — Response builders reutilizables
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message ?? 'Operation successful',
    timestamp: new Date().toISOString()
  };
}

export function createErrorResponse<T>(message: string): ApiResponse<T> {
  return {
    success: false,
    data: null as unknown as T,
    message,
    timestamp: new Date().toISOString()
  };
}
```

```typescript
// ✅ Uso en mock service
@Injectable({ providedIn: 'root' })
export class MockAuthService {
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    const user = MOCK_USERS.find(u => u.username === credentials.username);

    if (user) {
      return of(createSuccessResponse({ token: 'mock-jwt-token', user }))
        .pipe(delay(500));  // Simular latencia
    }

    return of(createErrorResponse<LoginResponse>('Invalid credentials'))
      .pipe(delay(500));
  }
}
```

### 4. Inyección de Dependencias con inject()

```typescript
// ✅ RECOMENDADO — inject() function (Angular 14+)
export class AuthorizationComponent {
  private authService = inject(AuthorizationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
}

// 👌 ACEPTABLE — Constructor injection (para compatibilidad)
export class AuthorizationComponent {
  constructor(
    private authService: AuthorizationService,
    private router: Router
  ) {}
}
```

---

## 🎨 **Design Tokens y CSS**

### Variables CSS (Design Tokens)

```css
/* ✅ CORRECTO — Design tokens en :root (styles.css) */
:root {
  /* Colores primarios */
  --primary-color: #007bff;
  --primary-hover: #0056b3;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;

  /* Tipografía */
  --font-family-base: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-size-base: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.25rem;
  --line-height-base: 1.5;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;

  /* Bordes y sombras */
  --border-radius: 0.375rem;
  --border-radius-lg: 0.5rem;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* Z-index scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-tooltip: 1070;

  /* Focus */
  --focus-ring-color: rgba(0, 123, 255, 0.25);
  --focus-ring-width: 0.25rem;
}

/* ❌ INCORRECTO — Valores hardcoded */
.button {
  background-color: #007bff;          /* Usar var(--primary-color) */
  padding: 8px 16px;                  /* Usar var(--spacing-sm) var(--spacing-md) */
  border-radius: 4px;                 /* Usar var(--border-radius) */
}
```

**Reglas CSS:**
- **Obligatorio**: Usar CSS custom properties (design tokens) para colores, espaciado, tipografía
- **Obligatorio**: Accesibilidad focus-visible en elementos interactivos
- **Recomendado**: Estilos de componente en archivo `.component.css` separado
- **Recomendado**: Bootstrap utilities antes de CSS custom cuando sea apropiado
- **Prohibido**: `!important` (excepto overrides de Bootstrap justificados)
- **Prohibido**: `px` hardcoded para tipografía (usar `rem`)

### Responsividad

```css
/* ✅ CORRECTO — Mobile-first con breakpoints Bootstrap */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 🔧 **Configuración de Herramientas**

### EditorConfig

```ini
# .editorconfig (ya configurado en el proyecto)
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.ts]
quote_type = single

[*.md]
trim_trailing_whitespace = false
```

### TypeScript Configuration

```jsonc
// tsconfig.json — Configuración activa
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "useDefineForClassFields": false,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "skipLibCheck": true
  }
}
```

### Recomendación: ESLint (por configurar)

> ⚠️ **Nota**: Actualmente el proyecto no tiene ESLint configurado. Se recomienda agregar:

```bash
ng add @angular-eslint/schematics
```

```json
{
  "extends": [
    "plugin:@angular-eslint/recommended",
    "plugin:@angular-eslint/template/process-inline-templates"
  ],
  "rules": {
    "@angular-eslint/component-selector": ["error", { "prefix": "app", "style": "kebab-case", "type": "element" }],
    "@angular-eslint/directive-selector": ["error", { "prefix": "app", "style": "camelCase", "type": "attribute" }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Scripts del Proyecto

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:ci": "ng test --no-watch --code-coverage"
  }
}
```

---

## 🧪 **Estándares de Testing**

### Estructura de Tests Unitarios

```typescript
// ✅ CORRECTO — describe/it con nombres descriptivos
describe('AuthorizationFormComponent', () => {
  let component: AuthorizationFormComponent;
  let fixture: ComponentFixture<AuthorizationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizationFormComponent]  // Standalone: imports, no declarations
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorizationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should require firstName with minimum 2 characters', () => {
      const control = component.authorizationForm.get('firstName');
      control?.setValue('A');
      expect(control?.valid).toBeFalse();

      control?.setValue('Ana');
      expect(control?.valid).toBeTrue();
    });

    it('should conditionally require licensePlate when hasVehicle is true', () => {
      component.authorizationForm.get('hasVehicle')?.setValue(true);
      component.onHasVehicleChange();

      const licensePlate = component.authorizationForm.get('licensePlate');
      expect(licensePlate?.hasValidator(Validators.required)).toBeTrue();
    });
  });
});
```

**Reglas de naming en tests:**
- `describe`: Nombre de la clase/función bajo test
- `describe` anidados: Grupo funcional o método
- `it`: `should + comportamiento esperado`

### Property-Based Testing con fast-check

```typescript
// ✅ CORRECTO — Generadores (Arbitraries) con JSDoc
import * as fc from 'fast-check';

/**
 * Generates a random valid first name (2-50 characters, letters only)
 */
export const firstNameArbitrary = (): fc.Arbitrary<string> =>
  fc.stringMatching(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/);

/**
 * Generates a valid AuthorizationFormValue with all required fields
 */
export const authorizationFormValueArbitrary = (): fc.Arbitrary<AuthorizationFormValue> =>
  fc.record({
    firstName: firstNameArbitrary(),
    lastName: lastNameArbitrary(),
    idDocument: idDocumentArbitrary(),
    entryType: entryTypeArbitrary(),
    hasVehicle: fc.boolean(),
    licensePlate: fc.option(licensePlateArbitrary(), { nil: '' }),
    validityPeriod: validityPeriodArbitrary()
  });
```

```typescript
// ✅ Uso en tests
describe('Authorization property tests', () => {
  it('should always create valid records from valid form data', () => {
    fc.assert(
      fc.property(authorizationFormValueArbitrary(), (formValue) => {
        const record = createRecordFromForm(formValue);
        expect(record.firstName).toBeTruthy();
        expect(record.status).toBe('active');
        expect(['visitor', 'courier']).toContain(record.entryType);
      })
    );
  });
});
```

**Reglas:**
- Generadores en `src/app/testing/generators.ts` (archivos separados por dominio)
- Sufijo `Arbitrary` en funciones generadoras: `firstNameArbitrary()`, `entryTypeArbitrary()`
- Cada generador con JSDoc describiendo restricciones
- Property tests para validación de modelos, type guards, y lógica pura

### Configuración de Tests para Standalone Components

```typescript
// ✅ CORRECTO — TestBed para standalone
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyStandaloneComponent],  // ← imports, NO declarations
    providers: [
      { provide: MyService, useValue: mockService }
    ]
  }).compileComponents();
});

// ❌ INCORRECTO — declarations con standalone
beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [MyStandaloneComponent],  // ERROR con standalone
  }).compileComponents();
});
```

---

## 📊 **Métricas y Calidad**

### Umbrales de Calidad

| Métrica                     | Umbral Mínimo   | Herramienta     |
| --------------------------- | --------------- | --------------- |
| **Cobertura de Tests**      | 80%             | Karma + Istanbul|
| **Bundle Size (initial)**   | < 500kB warning | Angular CLI     |
| **Bundle Size (initial)**   | < 1MB error     | Angular CLI     |
| **Complejidad Ciclomática** | < 10            | ESLint (futuro) |
| **TypeScript Strict**       | 100%            | tsc             |

### Build Budgets (angular.json)

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kB",
      "maximumError": "1MB"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "2kB",
      "maximumError": "4kB"
    }
  ]
}
```

### Code Review Checklist

- [ ] ✅ Componente es `standalone: true`
- [ ] ✅ Nivel Atomic Design correcto (atom/molecule/organism/template/page)
- [ ] ✅ Subscripciones con `takeUntil(this.destroy$)` o `Subscription`
- [ ] ✅ Sin `any` explícito ni implícito
- [ ] ✅ JSDoc en métodos públicos de servicios
- [ ] ✅ Guard/interceptor funcional (no clase)
- [ ] ✅ Design tokens en vez de valores hardcoded
- [ ] ✅ Tests con `imports` (no `declarations`) para standalone
- [ ] ✅ Lazy loading en rutas con `loadComponent`
- [ ] ✅ Error handling en observables HTTP
- [ ] ✅ Selector con prefijo `app-` y formato kebab-case
- [ ] ✅ Sin `NgModule`

---

## 🚀 **Mejores Prácticas Específicas**

### Angular 18.2

- **Standalone por defecto**: No crear NgModules bajo ninguna circunstancia
- **Functional APIs**: Usar `inject()`, guards funcionales, interceptors funcionales
- **Signals**: Preferir signals sobre observables para estado local de componentes
- **Defer blocks**: Usar `@defer` para carga diferida de componentes pesados
- **Control flow**: Preferir `@if`, `@for`, `@switch` sobre `*ngIf`, `*ngFor`, `ngSwitch`
- **Service Worker**: Configuración PWA activa con `ngsw-config.json`

### TypeScript 5.5

- **Satisfies operator**: Usar `satisfies` para validar tipos sin ampliar
- **Template literal types**: Para selectores y rutas tipadas
- **Const assertions**: `as const` para valores literales inmutables
- **Type narrowing**: Aprovechar narrowing automático en control flow

### RxJS 7.8

- **Operadores pipeable**: Siempre usar `.pipe()`, nunca operadores de prototipo
- **Creación**: Preferir `of()`, `from()`, `timer()` sobre `new Observable()`
- **Error handling**: `catchError` + `throwError()` (factory function, no `throwError(error)`)
- **Multicasting**: Usar `shareReplay()` para datos compartidos cachéables
- **Memory leaks**: Auditar `takeUntil`, `first()`, `take()` regularmente

### Performance

- **Lazy loading**: Todas las páginas cargadas con `loadComponent`
- **Bundle budgets**: Respetar 500kB warning / 1MB error
- **TrackBy**: Usar `trackBy` en `@for` para listas dinámicas
- **OnPush**: Considerar `ChangeDetectionStrategy.OnPush` para componentes puros
- **Tree-shaking**: Importar operadores RxJS individualmente, no `rxjs/operators`

### Seguridad

- **Tokens JWT**: Almacenar en `localStorage` con manejo seguro en `AuthenticationService`
- **XSS**: No usar `innerHTML` directamente; preferir binding de Angular
- **Content Security**: Service Worker configurado con `ngsw-config.json`
- **Interceptors**: Centralizar autenticación en interceptores
- **Sanitización**: Angular sanitiza automáticamente; no desactivar `DomSanitizer` sin justificación

---

## 🔄 **Proceso de Actualización**

### Cuándo Actualizar estos Estándares

1. **Migración de Angular** — Al actualizar a Angular 19+ o posterior
2. **Adopción de ESLint** — Cuando se configure linting automático
3. **Nuevos patrones** — Al introducir NgRx, Signals avanzados, SSR
4. **Lecciones aprendidas** — Problemas recurrentes en code reviews
5. **Revisión trimestral** — Evaluación periódica de efectividad

### Proponer Cambios

1. Crear issue describiendo la propuesta con justificación
2. Discutir en reunión técnica del equipo
3. Implementar ejemplo en branch de prueba
4. Actualizar este documento
5. Comunicar cambios al equipo

---

## 📚 **Referencias y Recursos**

### Documentación Oficial

- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Standalone Components](https://angular.dev/guide/components/importing)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [RxJS Documentation](https://rxjs.dev/guide/overview)
- [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/)

### Herramientas Configuradas

- **Build**: Angular CLI 18.2
- **Testing**: Jasmine 5.2 + Karma 6.4 + fast-check
- **Formatting**: EditorConfig (2 spaces, single quotes, UTF-8)
- **PWA**: Angular Service Worker + ngsw-config.json
- **CSS**: Bootstrap 5.3.8 + CSS Custom Properties (Design Tokens)

### Recursos de Aprendizaje

- [Atomic Design by Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Property-Based Testing with fast-check](https://fast-check.dev/)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**NOTA IMPORTANTE**: Estos estándares fueron generados analizando el código base existente de Atlas Platform y las prácticas del equipo. Deben evolucionar con el proyecto y ser revisados periódicamente.

---

_Documento generado con Método Ceiba - Arquitecto_  
_Última actualización: 2025-07-15_  
_Versión: 1.0_
