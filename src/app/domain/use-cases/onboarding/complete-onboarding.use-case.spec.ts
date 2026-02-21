import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CompleteOnboardingUseCase } from './complete-onboarding.use-case';
import { OnboardingGateway } from '@domain/gateways/onboarding/onboarding.gateway';
import { OnboardingRequest, OnboardingResponse, OrganizationType } from '@domain/models/onboarding/onboarding.model';
import { success } from '@domain/models/common/api-response.model';

describe('CompleteOnboardingUseCase', () => {
  let useCase: CompleteOnboardingUseCase;
  let onboardingGateway: jasmine.SpyObj<OnboardingGateway>;

  const mockRequest: OnboardingRequest = {
    organizationName: 'Conjunto Residencial Test',
    address: 'Calle 1 #2-3',
    nit: '900123456-1',
    phone: '3001234567',
    organizationType: OrganizationType.CONJUNTO
  };

  beforeEach(() => {
    onboardingGateway = jasmine.createSpyObj('OnboardingGateway', ['completeOnboarding']);

    TestBed.configureTestingModule({
      providers: [
        CompleteOnboardingUseCase,
        { provide: OnboardingGateway, useValue: onboardingGateway }
      ]
    });

    useCase = TestBed.inject(CompleteOnboardingUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should return success when onboarding completes', (done) => {
    const response: OnboardingResponse = {
      completed: true,
      organizationId: 'org-123',
      message: 'Organización creada exitosamente'
    };
    onboardingGateway.completeOnboarding.and.returnValue(of(success(response)));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeTrue();
      if (result.success) {
        expect(result.data.completed).toBeTrue();
        expect(result.data.organizationId).toBe('org-123');
      }
      done();
    });
  });

  it('should return failure when gateway throws error', (done) => {
    onboardingGateway.completeOnboarding.and.returnValue(throwError(() => new Error('Duplicate NIT')));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('ONBOARDING_ERROR');
        expect(result.error.message).toBe('Duplicate NIT');
      }
      done();
    });
  });

  it('should return default error message when error has no message', (done) => {
    onboardingGateway.completeOnboarding.and.returnValue(throwError(() => ({})));

    useCase.execute(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.message).toBe('No se pudo completar el registro. Intenta de nuevo');
      }
      done();
    });
  });
});
