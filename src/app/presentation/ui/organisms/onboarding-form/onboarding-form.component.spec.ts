import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingFormComponent, OnboardingFormData } from './onboarding-form.component';
import { OrganizationType } from '@domain/models/onboarding/onboarding.model';

describe('OnboardingFormComponent', () => {
  let component: OnboardingFormComponent;
  let fixture: ComponentFixture<OnboardingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OnboardingFormComponent]
    });

    fixture = TestBed.createComponent(OnboardingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.onboardingForm.valid).toBeFalse();
  });

  it('should require organizationName', () => {
    const control = component.onboardingForm.get('organizationName');
    control?.markAsTouched();
    expect(component.getOrganizationNameError()).toBe('El nombre de la organización es obligatorio');
  });

  it('should require address', () => {
    const control = component.onboardingForm.get('address');
    control?.markAsTouched();
    expect(component.getAddressError()).toBe('La dirección es obligatoria');
  });

  it('should allow optional email but validate format', () => {
    const control = component.onboardingForm.get('email');
    control?.setValue('invalid');
    control?.markAsTouched();
    expect(component.getEmailError()).toBe('Ingresa un correo electrónico válido');
  });

  it('should validate NIT pattern', () => {
    const control = component.onboardingForm.get('nit');
    control?.setValue('abc');
    control?.markAsTouched();
    expect(component.getNitError()).toBe('Formato de NIT inválido (ej: 900123456-1)');
  });

  it('should validate phone pattern', () => {
    const control = component.onboardingForm.get('phone');
    control?.setValue('123');
    control?.markAsTouched();
    expect(component.getPhoneError()).toBe('Número de teléfono inválido (7-10 dígitos)');
  });

  it('should require organizationType', () => {
    const control = component.onboardingForm.get('organizationType');
    control?.markAsTouched();
    expect(component.getOrganizationTypeError()).toBe('Selecciona el tipo de propiedad');
  });

  it('should emit formData on valid submit', () => {
    component.onboardingForm.patchValue({
      organizationName: 'Torres del Parque',
      address: 'Calle 100 #15-20',
      email: 'info@torres.co',
      nit: '900123456-1',
      phone: '3001234567',
      organizationType: OrganizationType.CONJUNTO
    });

    let emitted: OnboardingFormData | undefined;
    component.submitForm.subscribe(data => emitted = data);

    component.onSubmit();

    expect(emitted).toEqual({
      organizationName: 'Torres del Parque',
      address: 'Calle 100 #15-20',
      email: 'info@torres.co',
      nit: '900123456-1',
      phone: '3001234567',
      organizationType: OrganizationType.CONJUNTO
    });
  });

  it('should markAllAsTouched on invalid submit', () => {
    spyOn(component.onboardingForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.onboardingForm.markAllAsTouched).toHaveBeenCalled();
  });
});
