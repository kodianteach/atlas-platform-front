# Technology Stack

## Framework & Core Libraries
- **Angular 18.2** - Modern standalone component architecture
- **TypeScript 5.5** - Strict mode enabled
- **RxJS 7.8** - Reactive programming
- **Zone.js 0.14** - Change detection

## Build System
- **Angular CLI 18.2** - Project tooling and build system
- **Webpack** (via Angular CLI) - Module bundler
- **TypeScript Compiler** - Strict compilation settings

## Testing
- **Jasmine 5.2** - Testing framework
- **Karma 6.4** - Test runner
- **Karma Coverage** - Code coverage reporting

## Common Commands

### Development
```bash
npm start              # Start dev server on http://localhost:4200
ng serve              # Alternative dev server command
ng build --watch      # Build with watch mode
```

### Building
```bash
npm run build         # Production build (outputs to dist/)
ng build              # Same as above
```

### Testing
```bash
npm test              # Run unit tests with Karma
ng test               # Alternative test command
```

### Code Generation
```bash
ng generate component <name>    # Generate new component
ng generate service <name>       # Generate new service
ng generate directive <name>     # Generate new directive
ng generate pipe <name>          # Generate new pipe
ng generate guard <name>         # Generate new guard
ng generate interface <name>     # Generate new interface
```

## TypeScript Configuration
- Strict mode enabled
- ES2022 target
- Bundler module resolution
- Experimental decorators enabled
- Strict Angular templates
