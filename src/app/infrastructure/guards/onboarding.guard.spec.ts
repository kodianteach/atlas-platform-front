import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { onboardingGuard } from './onboarding.guard';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';
import { AuthUser } from '@domain/models/auth/auth.model';

describe('onboardingGuard', () => {
  let storageGateway: jasmine.SpyObj<StorageGateway>;
  let router: Router;

  beforeEach(() => {
    storageGateway = jasmine.createSpyObj('StorageGateway', ['getItem', 'setItem', 'removeItem', 'clear']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'login', component: {} as any },
        { path: 'onboarding', component: {} as any }
      ])],
      providers: [
        { provide: StorageGateway, useValue: storageGateway }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('should redirect ADMIN_ATLAS with ACTIVATED status to /onboarding', () => {
    const user: AuthUser = {
      id: '1', email: 'admin@test.com', name: 'Admin',
      role: 'ADMIN_ATLAS', status: 'ACTIVATED'
    };
    storageGateway.getItem.and.returnValue(user);

    const result = TestBed.runInInjectionContext(() => onboardingGuard({} as any, {} as any));

    expect(result).not.toBeTrue();
    expect((result as any).toString()).toContain('onboarding');
  });

  it('should redirect ADMIN_ATLAS (via roles array) with ACTIVATED status to /onboarding', () => {
    const user: AuthUser = {
      id: '1', email: 'admin@test.com', name: 'Admin',
      role: 'ADMIN_ATLAS', status: 'ACTIVATED',
      roles: ['ADMIN_ATLAS']
    };
    storageGateway.getItem.and.returnValue(user);

    const result = TestBed.runInInjectionContext(() => onboardingGuard({} as any, {} as any));

    expect(result).not.toBeTrue();
    expect((result as any).toString()).toContain('onboarding');
  });

  it('should allow ADMIN_ATLAS with ACTIVE status', () => {
    const user: AuthUser = {
      id: '1', email: 'admin@test.com', name: 'Admin',
      role: 'ADMIN_ATLAS', status: 'ACTIVE'
    };
    storageGateway.getItem.and.returnValue(user);

    const result = TestBed.runInInjectionContext(() => onboardingGuard({} as any, {} as any));

    expect(result).toBeTrue();
  });

  it('should allow user with non-ADMIN_ATLAS role', () => {
    const user: AuthUser = {
      id: '1', email: 'owner@test.com', name: 'Owner',
      role: 'OWNER', status: 'ACTIVATED'
    };
    storageGateway.getItem.and.returnValue(user);

    const result = TestBed.runInInjectionContext(() => onboardingGuard({} as any, {} as any));

    expect(result).toBeTrue();
  });

  it('should redirect to /login when no user in storage', () => {
    storageGateway.getItem.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() => onboardingGuard({} as any, {} as any));

    expect(result).not.toBeTrue();
    expect((result as any).toString()).toContain('login');
  });
});
