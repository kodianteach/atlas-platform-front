import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ValidateTokenUseCase } from './validate-token.use-case';
import { ActivationGateway } from '@domain/gateways/activation/activation.gateway';
import { TokenValidationResult } from '@domain/models/activation/activation.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';

describe('ValidateTokenUseCase', () => {
  let useCase: ValidateTokenUseCase;
  let activationGateway: jasmine.SpyObj<ActivationGateway>;

  beforeEach(() => {
    activationGateway = jasmine.createSpyObj('ActivationGateway', ['validateToken', 'activate']);

    TestBed.configureTestingModule({
      providers: [
        ValidateTokenUseCase,
        { provide: ActivationGateway, useValue: activationGateway }
      ]
    });

    useCase = TestBed.inject(ValidateTokenUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should return success when token is valid', (done) => {
    const tokenResult: TokenValidationResult = { valid: true, status: 'VALID', email: 'admin@test.com' };
    activationGateway.validateToken.and.returnValue(of(success(tokenResult)));

    useCase.execute('valid-token').subscribe(result => {
      expect(result.success).toBeTrue();
      if (result.success) {
        expect(result.data.valid).toBeTrue();
        expect(result.data.status).toBe('VALID');
        expect(result.data.email).toBe('admin@test.com');
      }
      done();
    });
  });

  it('should return success with EXPIRED status when token is expired', (done) => {
    const tokenResult: TokenValidationResult = { valid: false, status: 'EXPIRED' };
    activationGateway.validateToken.and.returnValue(of(success(tokenResult)));

    useCase.execute('expired-token').subscribe(result => {
      expect(result.success).toBeTrue();
      if (result.success) {
        expect(result.data.valid).toBeFalse();
        expect(result.data.status).toBe('EXPIRED');
      }
      done();
    });
  });

  it('should return success with CONSUMED status when token was already used', (done) => {
    const tokenResult: TokenValidationResult = { valid: false, status: 'CONSUMED' };
    activationGateway.validateToken.and.returnValue(of(success(tokenResult)));

    useCase.execute('consumed-token').subscribe(result => {
      expect(result.success).toBeTrue();
      if (result.success) {
        expect(result.data.valid).toBeFalse();
        expect(result.data.status).toBe('CONSUMED');
      }
      done();
    });
  });

  it('should return failure when gateway throws error', (done) => {
    activationGateway.validateToken.and.returnValue(throwError(() => new Error('Network error')));

    useCase.execute('any-token').subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('TOKEN_VALIDATION_ERROR');
        expect(result.error.message).toBe('Network error');
      }
      done();
    });
  });

  it('should return default error message when error has no message', (done) => {
    activationGateway.validateToken.and.returnValue(throwError(() => ({})));

    useCase.execute('any-token').subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.message).toBe('No se pudo validar el token. Intenta de nuevo');
      }
      done();
    });
  });
});
