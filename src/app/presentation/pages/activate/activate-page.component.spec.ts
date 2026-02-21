import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ActivatePageComponent } from './activate-page.component';
import { ValidateTokenUseCase } from '@domain/use-cases/activation/validate-token.use-case';
import { ActivateAdminUseCase } from '@domain/use-cases/activation/activate-admin.use-case';
import { ActivationGateway } from '@domain/gateways/activation/activation.gateway';
import { success, failure } from '@domain/models/common/api-response.model';

describe('ActivatePageComponent', () => {
  let component: ActivatePageComponent;
  let fixture: ComponentFixture<ActivatePageComponent>;
  let validateTokenUseCase: jasmine.SpyObj<ValidateTokenUseCase>;
  let activateAdminUseCase: jasmine.SpyObj<ActivateAdminUseCase>;
  let router: jasmine.SpyObj<Router>;
  let activationGateway: jasmine.SpyObj<ActivationGateway>;

  function setup(token: string = 'test-token') {
    validateTokenUseCase = jasmine.createSpyObj('ValidateTokenUseCase', ['execute']);
    activateAdminUseCase = jasmine.createSpyObj('ActivateAdminUseCase', ['execute']);
    activationGateway = jasmine.createSpyObj('ActivationGateway', ['validateToken', 'activate']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    // Default: valid token
    validateTokenUseCase.execute.and.returnValue(
      of(success({ valid: true, status: 'VALID' as const, email: 'test@test.com' }))
    );

    TestBed.configureTestingModule({
      imports: [ActivatePageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => token } } } },
        { provide: Router, useValue: router },
        { provide: ValidateTokenUseCase, useValue: validateTokenUseCase },
        { provide: ActivateAdminUseCase, useValue: activateAdminUseCase },
        { provide: ActivationGateway, useValue: activationGateway }
      ]
    });

    fixture = TestBed.createComponent(ActivatePageComponent);
    component = fixture.componentInstance;
  }

  it('should show loading initially then form for valid token', () => {
    setup('valid-token');
    fixture.detectChanges();
    expect(component.pageState()).toBe('token-valid');
  });

  it('should show no-token state when no token provided', () => {
    setup('');
    fixture.detectChanges();
    expect(component.pageState()).toBe('no-token');
  });

  it('should show token-consumed state for consumed token', () => {
    setup('consumed-token');
    validateTokenUseCase.execute.and.returnValue(
      of(success({ valid: false, status: 'CONSUMED' as const }))
    );
    fixture.detectChanges();
    expect(component.pageState()).toBe('token-consumed');
  });

  it('should show token-expired state for expired token', () => {
    setup('expired-token');
    validateTokenUseCase.execute.and.returnValue(
      of(success({ valid: false, status: 'EXPIRED' as const }))
    );
    fixture.detectChanges();
    expect(component.pageState()).toBe('token-expired');
  });

  it('should show token-invalid state for invalid token', () => {
    setup('bad-token');
    validateTokenUseCase.execute.and.returnValue(
      of(success({ valid: false, status: 'INVALID' as const }))
    );
    fixture.detectChanges();
    expect(component.pageState()).toBe('token-invalid');
  });

  it('should show token-invalid on gateway failure', () => {
    setup('error-token');
    validateTokenUseCase.execute.and.returnValue(
      of(failure({ code: 'ERROR', message: 'Network error', timestamp: new Date() }))
    );
    fixture.detectChanges();
    expect(component.pageState()).toBe('token-invalid');
  });

  it('should show activation-success on successful activation', () => {
    setup('valid-token');
    fixture.detectChanges();

    activateAdminUseCase.execute.and.returnValue(
      of(success({ activated: true, message: 'Activated!' }))
    );

    component.handleActivation({
      email: 'test@test.com',
      currentPassword: 'TempPass1',
      newPassword: 'NewPass123'
    });

    expect(component.pageState()).toBe('activation-success');
    expect(component.showPwaModal()).toBeTrue();
  });

  it('should show error on failed activation', () => {
    setup('valid-token');
    fixture.detectChanges();

    activateAdminUseCase.execute.and.returnValue(
      of(failure({ code: 'AUTH_FAILED', message: 'Credenciales incorrectas', timestamp: new Date() }))
    );

    component.handleActivation({
      email: 'test@test.com',
      currentPassword: 'WrongPass',
      newPassword: 'NewPass123'
    });

    expect(component.pageState()).toBe('token-valid');
    expect(component.generalError()).toBe('Credenciales incorrectas');
  });

  it('should navigate to login on goToLogin', () => {
    setup('valid-token');
    fixture.detectChanges();

    component.goToLogin();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should dismiss PWA modal', () => {
    setup('valid-token');
    fixture.detectChanges();

    component.showPwaModal.set(true);
    component.dismissPwaModal();

    expect(component.showPwaModal()).toBeFalse();
  });
});
