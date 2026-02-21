import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivateAdminUseCase } from './activate-admin.use-case';
import { ActivationGateway } from '@domain/gateways/activation/activation.gateway';
import { ActivateRequest, ActivateResponse } from '@domain/models/activation/activation.model';
import { success } from '@domain/models/common/api-response.model';

describe('ActivateAdminUseCase', () => {
  let useCase: ActivateAdminUseCase;
  let activationGateway: jasmine.SpyObj<ActivationGateway>;

  const mockRequest: ActivateRequest = {
    token: 'valid-token',
    email: 'admin@test.com',
    currentPassword: 'TempPass1',
    newPassword: 'NewPass123'
  };

  beforeEach(() => {
    activationGateway = jasmine.createSpyObj('ActivationGateway', ['validateToken', 'activate']);

    TestBed.configureTestingModule({
      providers: [
        ActivateAdminUseCase,
        { provide: ActivationGateway, useValue: activationGateway }
      ]
    });

    useCase = TestBed.inject(ActivateAdminUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should return success when activation succeeds', (done) => {
    const response: ActivateResponse = { activated: true, message: '¡Tu cuenta ha sido activada exitosamente!' };
    activationGateway.activate.and.returnValue(of(success(response)));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeTrue();
      if (result.success) {
        expect(result.data.activated).toBeTrue();
        expect(result.data.message).toContain('activada');
      }
      done();
    });
  });

  it('should return failure when gateway returns failure', (done) => {
    activationGateway.activate.and.returnValue(of({
      success: false as const,
      error: { code: 'AUTH_FAILED', message: 'Las credenciales temporales son incorrectas', timestamp: new Date() }
    }));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.message).toContain('incorrectas');
      }
      done();
    });
  });

  it('should return failure when gateway throws error', (done) => {
    activationGateway.activate.and.returnValue(throwError(() => new Error('Server error')));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('ACTIVATION_ERROR');
        expect(result.error.message).toBe('Server error');
      }
      done();
    });
  });

  it('should return default error message when error has no message', (done) => {
    activationGateway.activate.and.returnValue(throwError(() => ({})));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.message).toBe('No se pudo activar la cuenta. Intenta de nuevo');
      }
      done();
    });
  });
});
