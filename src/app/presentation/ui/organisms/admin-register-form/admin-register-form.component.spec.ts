import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRegisterFormComponent, AdminRegisterFormData } from './admin-register-form.component';
import { DocumentType } from '@domain/models/pre-registration/pre-registration.model';

describe('AdminRegisterFormComponent', () => {
  let component: AdminRegisterFormComponent;
  let fixture: ComponentFixture<AdminRegisterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminRegisterFormComponent]
    });

    fixture = TestBed.createComponent(AdminRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should require fullName', () => {
    const control = component.registerForm.get('fullName');
    control?.markAsTouched();
    expect(component.getFullNameError()).toBe('El nombre completo es obligatorio');
  });

  it('should require email', () => {
    const control = component.registerForm.get('email');
    control?.markAsTouched();
    expect(component.getEmailError()).toBe('El correo electrónico es obligatorio');
  });

  it('should validate email format', () => {
    const control = component.registerForm.get('email');
    control?.setValue('invalid');
    control?.markAsTouched();
    expect(component.getEmailError()).toBe('Ingresa un correo electrónico válido');
  });

  it('should require documentType', () => {
    const control = component.registerForm.get('documentType');
    control?.markAsTouched();
    expect(component.getDocumentTypeError()).toBe('Selecciona el tipo de documento');
  });

  it('should validate documentNumber pattern', () => {
    const control = component.registerForm.get('documentNumber');
    control?.setValue('123');
    control?.markAsTouched();
    expect(component.getDocumentNumberError()).toBe('Número de documento inválido (5-15 dígitos)');
  });

  it('should validate phone pattern', () => {
    const control = component.registerForm.get('phone');
    control?.setValue('123');
    control?.markAsTouched();
    expect(component.getPhoneError()).toBe('Número de teléfono inválido (7-10 dígitos)');
  });

  it('should emit formData on valid submit', () => {
    component.registerForm.patchValue({
      fullName: 'Juan Pérez',
      email: 'juan@test.com',
      documentType: DocumentType.CC,
      documentNumber: '1234567890',
      phone: '3001234567'
    });

    let emitted: AdminRegisterFormData | undefined;
    component.submitForm.subscribe(data => emitted = data);

    component.onSubmit();

    expect(emitted).toEqual({
      fullName: 'Juan Pérez',
      email: 'juan@test.com',
      documentType: DocumentType.CC,
      documentNumber: '1234567890',
      phone: '3001234567'
    });
  });

  it('should markAllAsTouched on invalid submit', () => {
    spyOn(component.registerForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.registerForm.markAllAsTouched).toHaveBeenCalled();
  });
});
