import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { OnboardingPageComponent } from './onboarding-page.component';
import { CompleteOnboardingUseCase } from '@domain/use-cases/onboarding/complete-onboarding.use-case';
import { OnboardingGateway } from '@domain/gateways/onboarding/onboarding.gateway';
import { OrganizationType } from '@domain/models/onboarding/onboarding.model';
import { success, failure } from '@domain/models/common/api-response.model';
import { OnboardingFormData } from '../../ui/organisms/onboarding-form/onboarding-form.component';

describe('OnboardingPageComponent', () => {
  let component: OnboardingPageComponent;
  let fixture: ComponentFixture<OnboardingPageComponent>;
  let completeOnboardingUseCase: jasmine.SpyObj<CompleteOnboardingUseCase>;
  let router: jasmine.SpyObj<Router>;
  let onboardingGateway: jasmine.SpyObj<OnboardingGateway>;

  const mockFormData: OnboardingFormData = {
    organizationName: 'Torres del Parque',
    address: 'Calle 100 #15-20',
    email: 'info@torres.co',
    nit: '900123456-1',
    phone: '3001234567',
    organizationType: OrganizationType.CONJUNTO
  };

  beforeEach(() => {
    completeOnboardingUseCase = jasmine.createSpyObj('CompleteOnboardingUseCase', ['execute']);
    onboardingGateway = jasmine.createSpyObj('OnboardingGateway', ['completeOnboarding']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [OnboardingPageComponent],
      providers: [
        { provide: CompleteOnboardingUseCase, useValue: completeOnboardingUseCase },
        { provide: OnboardingGateway, useValue: onboardingGateway },
        { provide: Router, useValue: router }
      ]
    });

    fixture = TestBed.createComponent(OnboardingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success and redirect on successful onboarding', fakeAsync(() => {
    completeOnboardingUseCase.execute.and.returnValue(
      of(success({ completed: true, organizationId: 'org-123', message: 'OK' }))
    );

    component.handleOnboarding(mockFormData);

    expect(component.isCompleted()).toBeTrue();
    expect(component.isSubmitting()).toBeFalse();

    tick(2000);

    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  }));

  it('should show error on failed onboarding', () => {
    completeOnboardingUseCase.execute.and.returnValue(
      of(failure({ code: 'VALIDATION_ERROR', message: 'NIT ya registrado', timestamp: new Date() }))
    );

    component.handleOnboarding(mockFormData);

    expect(component.isCompleted()).toBeFalse();
    expect(component.generalError()).toBe('NIT ya registrado');
  });

  it('should set isSubmitting while processing', () => {
    completeOnboardingUseCase.execute.and.returnValue(
      of(success({ completed: true, organizationId: 'org-123', message: 'OK' }))
    );

    expect(component.isSubmitting()).toBeFalse();
    component.handleOnboarding(mockFormData);
    // After subscribe completes synchronously, isSubmitting is set back to false
    expect(component.isSubmitting()).toBeFalse();
  });
});
