import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PreRegisterAdminUseCase } from './pre-register-admin.use-case';
import { PreRegistrationGateway } from '@domain/gateways/pre-registration/pre-registration.gateway';
import { PreRegisterRequest, PreRegisterResponse, DocumentType } from '@domain/models/pre-registration/pre-registration.model';
import { success } from '@domain/models/common/api-response.model';

describe('PreRegisterAdminUseCase', () => {
  let useCase: PreRegisterAdminUseCase;
  let preRegistrationGateway: jasmine.SpyObj<PreRegistrationGateway>;

  const mockRequest: PreRegisterRequest = {
    fullName: 'Juan Pérez',
    email: 'juan@test.com',
    documentType: DocumentType.CC,
    documentNumber: '1234567890',
    phone: '3001234567'
  };

  beforeEach(() => {
    preRegistrationGateway = jasmine.createSpyObj('PreRegistrationGateway', ['preRegister']);

    TestBed.configureTestingModule({
      providers: [
        PreRegisterAdminUseCase,
        { provide: PreRegistrationGateway, useValue: preRegistrationGateway }
      ]
    });

    useCase = TestBed.inject(PreRegisterAdminUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should return success when pre-registration succeeds', (done) => {
    const response: PreRegisterResponse = {
      registered: true,
      email: 'juan@test.com',
      message: 'Administrador pre-registrado exitosamente'
    };
    preRegistrationGateway.preRegister.and.returnValue(of(success(response)));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeTrue();
      if (result.success) {
        expect(result.data.registered).toBeTrue();
        expect(result.data.email).toBe('juan@test.com');
      }
      done();
    });
  });

  it('should return failure when gateway throws error', (done) => {
    preRegistrationGateway.preRegister.and.returnValue(throwError(() => new Error('Email already exists')));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('PRE_REGISTRATION_ERROR');
        expect(result.error.message).toBe('Email already exists');
      }
      done();
    });
  });

  it('should return default error message when error has no message', (done) => {
    preRegistrationGateway.preRegister.and.returnValue(throwError(() => ({})));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.message).toBe('No se pudo pre-registrar al administrador. Intenta de nuevo');
      }
      done();
    });
  });
});
