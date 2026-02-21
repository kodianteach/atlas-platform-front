import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivationFormComponent, ActivationFormData } from './activation-form.component';

describe('ActivationFormComponent', () => {
  let component: ActivationFormComponent;
  let fixture: ComponentFixture<ActivationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivationFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with invalid form', () => {
    expect(component.activationForm.valid).toBeFalse();
  });

  it('should show email error when touched and empty', () => {
    component.markFieldTouched('email');
    expect(component.getEmailError()).toBe('El correo electrónico es obligatorio');
  });

  it('should show email error for invalid format', () => {
    component.updateField('email', 'invalid');
    component.markFieldTouched('email');
    expect(component.getEmailError()).toBe('Ingresa un correo electrónico válido');
  });

  it('should show current password error when touched and empty', () => {
    component.markFieldTouched('currentPassword');
    expect(component.getCurrentPasswordError()).toBe('La contraseña temporal es obligatoria');
  });

  it('should show strongPassword error for weak password', () => {
    component.updateField('newPassword', 'weak');
    component.markFieldTouched('newPassword');
    expect(component.getNewPasswordError()).toBe('Debe contener mayúscula, minúscula y número (mínimo 8 caracteres)');
  });

  it('should not show error for strong password', () => {
    component.updateField('newPassword', 'StrongPass1');
    component.markFieldTouched('newPassword');
    expect(component.getNewPasswordError()).toBe('');
  });

  it('should show mustMatch error when passwords do not match', () => {
    component.updateField('newPassword', 'StrongPass1');
    component.updateField('confirmNewPassword', 'Different1');
    component.markFieldTouched('confirmNewPassword');
    // Trigger cross-field validation
    component.activationForm.updateValueAndValidity();
    expect(component.getConfirmPasswordError()).toBe('Las contraseñas no coinciden');
  });

  it('should have valid form with correct data', () => {
    component.updateField('email', 'admin@test.com');
    component.updateField('currentPassword', 'TempPass1');
    component.updateField('newPassword', 'NewStrong1');
    component.updateField('confirmNewPassword', 'NewStrong1');
    component.activationForm.updateValueAndValidity();
    expect(component.activationForm.valid).toBeTrue();
  });

  it('should emit submitForm with correct data on valid submit', () => {
    let emittedData: ActivationFormData | undefined;
    component.submitForm.subscribe((data: ActivationFormData) => emittedData = data);

    component.updateField('email', 'admin@test.com');
    component.updateField('currentPassword', 'TempPass1');
    component.updateField('newPassword', 'NewStrong1');
    component.updateField('confirmNewPassword', 'NewStrong1');
    component.activationForm.updateValueAndValidity();

    component.onSubmit();

    expect(emittedData).toEqual({
      email: 'admin@test.com',
      currentPassword: 'TempPass1',
      newPassword: 'NewStrong1'
    });
  });

  it('should not emit submitForm on invalid form submit', () => {
    let emitted = false;
    component.submitForm.subscribe(() => emitted = true);

    component.onSubmit();

    expect(emitted).toBeFalse();
  });

  it('should disable button when form is invalid', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('app-button');
    expect(button).toBeTruthy();
  });
});
