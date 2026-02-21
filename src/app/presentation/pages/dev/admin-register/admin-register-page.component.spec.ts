import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminRegisterPageComponent } from './admin-register-page.component';
import { PreRegisterAdminUseCase } from '@domain/use-cases/pre-registration/pre-register-admin.use-case';
import { PreRegistrationGateway } from '@domain/gateways/pre-registration/pre-registration.gateway';
import { DocumentType } from '@domain/models/pre-registration/pre-registration.model';
import { success, failure } from '@domain/models/common/api-response.model';
import { AdminRegisterFormData } from '../../../ui/organisms/admin-register-form/admin-register-form.component';

describe('AdminRegisterPageComponent', () => {
  let component: AdminRegisterPageComponent;
  let fixture: ComponentFixture<AdminRegisterPageComponent>;
  let preRegisterUseCase: jasmine.SpyObj<PreRegisterAdminUseCase>;
  let preRegistrationGateway: jasmine.SpyObj<PreRegistrationGateway>;

  const mockFormData: AdminRegisterFormData = {
    fullName: 'Juan Pérez',
    email: 'juan@test.com',
    documentType: DocumentType.CC,
    documentNumber: '1234567890',
    phone: '3001234567'
  };

  beforeEach(() => {
    preRegisterUseCase = jasmine.createSpyObj('PreRegisterAdminUseCase', ['execute']);
    preRegistrationGateway = jasmine.createSpyObj('PreRegistrationGateway', ['preRegister']);

    TestBed.configureTestingModule({
      imports: [AdminRegisterPageComponent],
      providers: [
        { provide: PreRegisterAdminUseCase, useValue: preRegisterUseCase },
        { provide: PreRegistrationGateway, useValue: preRegistrationGateway }
      ]
    });

    fixture = TestBed.createComponent(AdminRegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success message on successful registration', () => {
    preRegisterUseCase.execute.and.returnValue(
      of(success({ registered: true, email: 'juan@test.com', message: 'OK' }))
    );

    component.handleRegister(mockFormData);

    expect(component.successMessage()).toContain('juan@test.com');
    expect(component.isSubmitting()).toBeFalse();
  });

  it('should show error on failed registration', () => {
    preRegisterUseCase.execute.and.returnValue(
      of(failure({ code: 'DUPLICATE_EMAIL', message: 'El correo ya está registrado', timestamp: new Date() }))
    );

    component.handleRegister(mockFormData);

    expect(component.generalError()).toBe('El correo ya está registrado');
    expect(component.successMessage()).toBeUndefined();
  });

  it('should reset form state', () => {
    component.successMessage.set('Test message');
    component.generalError.set('Test error');

    component.resetForm();

    expect(component.successMessage()).toBeUndefined();
    expect(component.generalError()).toBeUndefined();
  });
});
