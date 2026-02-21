import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';

describe('authGuard', () => {
  let storageGateway: jasmine.SpyObj<StorageGateway>;
  let router: Router;

  beforeEach(() => {
    storageGateway = jasmine.createSpyObj('StorageGateway', ['getItem', 'setItem', 'removeItem', 'clear']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'login', component: {} as any }
      ])],
      providers: [
        { provide: StorageGateway, useValue: storageGateway }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('should allow navigation when token exists', () => {
    storageGateway.getItem.and.returnValue('valid-jwt-token');

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).toBeTrue();
  });

  it('should redirect to /login when no token', () => {
    storageGateway.getItem.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).not.toBeTrue();
    expect((result as any).toString()).toContain('login');
  });

  it('should redirect to /login when token is empty string', () => {
    storageGateway.getItem.and.returnValue('');

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).not.toBeTrue();
    expect((result as any).toString()).toContain('login');
  });
});
