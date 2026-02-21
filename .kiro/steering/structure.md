---
inclusion: always
---

# Project Structure & Organization

## Directory Structure

### Root Level
```
atlas-platform/
├── src/                    # Application source code
├── public/                 # Static assets (favicon, etc.)
├── node_modules/           # Dependencies (do not modify)
├── dist/                   # Build output (generated, do not commit)
├── .kiro/                  # Kiro configuration and steering
├── angular.json            # Angular CLI configuration
├── package.json            # Dependencies and scripts
└── tsconfig.*.json         # TypeScript configurations
```

### Source Directory (`src/app/`)
```
src/app/
├── ui/                     # UI components (Atomic Design)
│   ├── atoms/              # Basic building blocks (buttons, inputs, icons)
│   ├── molecules/          # Simple combinations (form-field, card-header)
│   ├── organisms/          # Complex sections (authorization-form, header, sidebar)
│   └── templates/          # Page layouts (no data logic)
├── pages/                  # Route-level components (data orchestration)
├── services/               # Business logic and data access
├── testing/                # Shared test utilities and generators
├── app.component.*         # Root component
├── app.config.ts           # Application configuration
└── app.routes.ts           # Route definitions
```

## Architecture Rules

### Atomic Design Hierarchy
1. **Atoms** (`src/app/ui/atoms/`): Smallest reusable components with no business logic
   - Examples: buttons, inputs, labels, icons
   - Only accept @Input() and emit @Output()
   - No service injection or HTTP calls

2. **Molecules** (`src/app/ui/molecules/`): Simple combinations of atoms
   - Examples: form-field (label + input + error), search-box
   - Minimal logic, mostly presentational
   - Can use services for UI-only concerns (not data fetching)

3. **Organisms** (`src/app/ui/organisms/`): Complex UI sections
   - Examples: authorization-form, navigation-header, data-table
   - Can contain internal state and validation logic
   - Should remain presentational (use @Input/@Output for data)

4. **Templates** (`src/app/ui/templates/`): Page layout structures
   - Define composition and placement of organisms
   - No direct data access or business logic
   - Use content projection (ng-content) when appropriate

5. **Pages** (`src/app/pages/`): Route-level orchestrators
   - Handle routing, data fetching, and state management
   - Inject services and manage business logic
   - Compose templates and organisms
   - One page per route

### Standalone Components
- All components use Angular's standalone architecture
- Explicitly import dependencies in component metadata
- No NgModules required for new components
- Use `imports: [CommonModule, FormsModule, ...]` in @Component decorator

### Component File Structure
Each component must have 4 files:
- `<name>.component.ts` - Component class and metadata
- `<name>.component.html` - Template markup
- `<name>.component.css` - Component-specific styles
- `<name>.component.spec.ts` - Unit tests (Jasmine/Karma)

### Service Organization
- Place services in `src/app/services/`
- Use `@Injectable({ providedIn: 'root' })` for singleton services
- Service files: `<name>.service.ts` and `<name>.service.spec.ts`
- Keep business logic and data access in services, not components

### Testing Structure
- Test files must be co-located with source files
- Use `.spec.ts` suffix for all test files
- Shared test utilities go in `src/app/testing/`
- Property-based test generators in `src/app/testing/generators.ts`

## File Naming Conventions

- Use kebab-case for all file names: `authorization-form.component.ts`
- Component files: `<name>.component.ts`
- Service files: `<name>.service.ts`
- Test files: `<name>.spec.ts`
- Utility files: `<name>.ts`
- Component selector prefix: `app-`

## Code Organization Rules

### When Creating New Components
1. Determine the atomic level (atom/molecule/organism/template/page)
2. Place in the appropriate `src/app/ui/<level>/` or `src/app/pages/` directory
3. Use Angular CLI: `ng generate component ui/<level>/<name>`
4. Create all 4 files (.ts, .html, .css, .spec.ts)

### When Creating New Services
1. Place in `src/app/services/`
2. Use Angular CLI: `ng generate service services/<name>`
3. Include unit tests in `.spec.ts` file

### Data Flow Pattern
- Pages fetch data from services
- Pages pass data down to organisms/molecules/atoms via @Input()
- Child components emit events up via @Output()
- Avoid prop drilling: use services for deeply nested data needs

### Import Organization
Order imports in TypeScript files:
1. Angular core imports
2. Angular common imports (CommonModule, FormsModule, etc.)
3. Third-party libraries
4. Local application imports (services, components, models)

## Build Output
- Production builds: `dist/atlas-platform/`
- Development builds include source maps
- Bundle size budgets: 500kB warning, 1MB error for initial bundle
- Do not commit `dist/` directory
