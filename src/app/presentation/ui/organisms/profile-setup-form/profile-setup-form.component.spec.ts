import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileSetupFormComponent } from './profile-setup-form.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { TextInputComponent } from '../../atoms/text-input/text-input.component';
import { ButtonComponent } from '../../atoms/button/button.component';

describe('ProfileSetupFormComponent', () => {
  let component: ProfileSetupFormComponent;
  let fixture: ComponentFixture<ProfileSetupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileSetupFormComponent,
        ReactiveFormsModule,
        FormFieldComponent,
        TextInputComponent,
        ButtonComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSetupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('fullName')?.value).toBe('');
    expect(component.form.get('phoneNumber')?.value).toBe('');
    expect(component.form.get('adminId')?.value).toBe('');
  });

  it('should initialize form with initial data when provided', () => {
    const initialData = {
      fullName: 'John Doe',
      phoneNumber: '+1 555-1234',
      adminId: 'ID-12345'
    };
    
    fixture.componentRef.setInput('initialData', initialData);
    component.ngOnInit();
    
    expect(component.form.get('fullName')?.value).toBe(initialData.fullName);
    expect(component.form.get('phoneNumber')?.value).toBe(initialData.phoneNumber);
    expect(component.form.get('adminId')?.value).toBe(initialData.adminId);
  });

  it('should mark form as invalid when full name is empty', () => {
    const fullNameControl = component.form.get('fullName');
    fullNameControl?.setValue('');
    fullNameControl?.markAsTouched();
    
    expect(fullNameControl?.invalid).toBeTruthy();
    expect(fullNameControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark form as invalid when full name is too short', () => {
    const fullNameControl = component.form.get('fullName');
    fullNameControl?.setValue('A');
    fullNameControl?.markAsTouched();
    
    expect(fullNameControl?.invalid).toBeTruthy();
    expect(fullNameControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should mark form as invalid when full name contains invalid characters', () => {
    const fullNameControl = component.form.get('fullName');
    fullNameControl?.setValue('John123');
    fullNameControl?.markAsTouched();
    
    expect(fullNameControl?.invalid).toBeTruthy();
    expect(fullNameControl?.errors?.['pattern']).toBeTruthy();
  });

  it('should mark form as valid when full name is valid', () => {
    const fullNameControl = component.form.get('fullName');
    fullNameControl?.setValue('Marcus Aurelius');
    fullNameControl?.markAsTouched();
    
    expect(fullNameControl?.valid).toBeTruthy();
  });

  it('should mark form as invalid when phone number is empty', () => {
    const phoneControl = component.form.get('phoneNumber');
    phoneControl?.setValue('');
    phoneControl?.markAsTouched();
    
    expect(phoneControl?.invalid).toBeTruthy();
    expect(phoneControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark form as invalid when phone number has invalid format', () => {
    const phoneControl = component.form.get('phoneNumber');
    phoneControl?.setValue('abc-def-ghij');
    phoneControl?.markAsTouched();
    
    expect(phoneControl?.invalid).toBeTruthy();
    expect(phoneControl?.errors?.['pattern']).toBeTruthy();
  });

  it('should mark form as valid when phone number is valid', () => {
    const phoneControl = component.form.get('phoneNumber');
    phoneControl?.setValue('+1 (555) 000-0000');
    phoneControl?.markAsTouched();
    
    expect(phoneControl?.valid).toBeTruthy();
  });

  it('should mark form as invalid when admin ID is empty', () => {
    const adminIdControl = component.form.get('adminId');
    adminIdControl?.setValue('');
    adminIdControl?.markAsTouched();
    
    expect(adminIdControl?.invalid).toBeTruthy();
    expect(adminIdControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark form as invalid when admin ID is too short', () => {
    const adminIdControl = component.form.get('adminId');
    adminIdControl?.setValue('AB');
    adminIdControl?.markAsTouched();
    
    expect(adminIdControl?.invalid).toBeTruthy();
    expect(adminIdControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should mark form as valid when admin ID is valid', () => {
    const adminIdControl = component.form.get('adminId');
    adminIdControl?.setValue('ID-883492');
    adminIdControl?.markAsTouched();
    
    expect(adminIdControl?.valid).toBeTruthy();
  });

  it('should emit formSubmit event when form is valid and submitted', () => {
    spyOn(component.formSubmit, 'emit');
    
    component.form.get('fullName')?.setValue('Marcus Aurelius');
    component.form.get('phoneNumber')?.setValue('+1 (555) 000-0000');
    component.form.get('adminId')?.setValue('ID-883492');
    
    component.onSubmit();
    
    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      fullName: 'Marcus Aurelius',
      phoneNumber: '+1 (555) 000-0000',
      adminId: 'ID-883492'
    });
  });

  it('should not emit formSubmit event when form is invalid', () => {
    spyOn(component.formSubmit, 'emit');
    
    component.form.get('fullName')?.setValue('');
    component.form.get('phoneNumber')?.setValue('');
    component.form.get('adminId')?.setValue('');
    
    component.onSubmit();
    
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should emit formCancel event when cancel is called', () => {
    spyOn(component.formCancel, 'emit');
    
    component.onCancel();
    
    expect(component.formCancel.emit).toHaveBeenCalled();
  });

  it('should return correct error message for full name required', () => {
    const fullNameControl = component.form.get('fullName');
    fullNameControl?.setValue('');
    fullNameControl?.markAsTouched();
    
    expect(component.getErrorMessage('fullName')).toBe('Full name is required');
  });

  it('should return correct error message for phone number required', () => {
    const phoneControl = component.form.get('phoneNumber');
    phoneControl?.setValue('');
    phoneControl?.markAsTouched();
    
    expect(component.getErrorMessage('phoneNumber')).toBe('Phone number is required');
  });

  it('should return correct error message for admin ID required', () => {
    const adminIdControl = component.form.get('adminId');
    adminIdControl?.setValue('');
    adminIdControl?.markAsTouched();
    
    expect(component.getErrorMessage('adminId')).toBe('Admin ID is required');
  });

  it('should return empty string when field has no errors', () => {
    const fullNameControl = component.form.get('fullName');
    fullNameControl?.setValue('Marcus Aurelius');
    fullNameControl?.markAsTouched();
    
    expect(component.getErrorMessage('fullName')).toBe('');
  });

  it('should return true for hasError when field is invalid and touched', () => {
    const fullNameControl = component.form.get('fullName');
    fullNameControl?.setValue('');
    fullNameControl?.markAsTouched();
    
    expect(component.hasError('fullName')).toBeTruthy();
  });

  it('should return false for hasError when field is valid', () => {
    const fullNameControl = component.form.get('fullName');
    fullNameControl?.setValue('Marcus Aurelius');
    fullNameControl?.markAsTouched();
    
    expect(component.hasError('fullName')).toBeFalsy();
  });
});
