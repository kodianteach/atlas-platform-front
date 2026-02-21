import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorizationFormComponent } from './authorization-form.component';

describe('AuthorizationFormComponent', () => {
  let component: AuthorizationFormComponent;
  let fixture: ComponentFixture<AuthorizationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizationFormComponent, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.get('entryType')?.value).toBe('visitor');
    expect(component.form.get('hasVehicle')?.value).toBe(false);
    expect(component.form.get('validityPeriod')?.value).toBe(60);
  });

  it('should display form when visible is true', () => {
    component.visible = true;
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.authorization-form-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should hide form when visible is false', () => {
    component.visible = false;
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.authorization-form-overlay');
    expect(overlay).toBeFalsy();
  });

  it('should require licensePlate when hasVehicle is true', () => {
    component.form.patchValue({ hasVehicle: true });
    fixture.detectChanges();
    
    const licensePlateControl = component.form.get('licensePlate');
    expect(licensePlateControl?.hasError('required')).toBe(true);
  });

  it('should not require licensePlate when hasVehicle is false', () => {
    component.form.patchValue({ hasVehicle: false });
    fixture.detectChanges();
    
    const licensePlateControl = component.form.get('licensePlate');
    expect(licensePlateControl?.hasError('required')).toBeFalsy();
  });

  it('should require courier fields when entryType is courier', () => {
    component.form.patchValue({ entryType: 'courier' });
    fixture.detectChanges();
    
    const orderOriginControl = component.form.get('orderOrigin');
    const orderTypeControl = component.form.get('orderType');
    expect(orderOriginControl?.hasError('required')).toBe(true);
    expect(orderTypeControl?.hasError('required')).toBe(true);
  });

  it('should not require courier fields when entryType is visitor', () => {
    component.form.patchValue({ entryType: 'visitor' });
    fixture.detectChanges();
    
    const orderOriginControl = component.form.get('orderOrigin');
    const orderTypeControl = component.form.get('orderType');
    expect(orderOriginControl?.hasError('required')).toBeFalsy();
    expect(orderTypeControl?.hasError('required')).toBeFalsy();
  });

  it('should emit formSubmit when form is valid and submitted', () => {
    spyOn(component.formSubmit, 'emit');
    
    component.form.patchValue({
      firstName: 'Juan',
      lastName: 'Pérez',
      idDocument: 'ABC123',
      entryType: 'visitor',
      hasVehicle: false,
      validityPeriod: 60
    });
    
    component.onSubmit();
    
    expect(component.formSubmit.emit).toHaveBeenCalled();
  });

  it('should not emit formSubmit when form is invalid', () => {
    spyOn(component.formSubmit, 'emit');
    
    component.form.patchValue({
      firstName: '',
      lastName: '',
      idDocument: ''
    });
    
    component.onSubmit();
    
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should reset form after successful submission', () => {
    component.form.patchValue({
      firstName: 'Juan',
      lastName: 'Pérez',
      idDocument: 'ABC123',
      entryType: 'visitor',
      hasVehicle: false,
      validityPeriod: 60
    });
    
    component.onSubmit();
    
    expect(component.form.get('firstName')?.value).toBe('');
    expect(component.form.get('lastName')?.value).toBe('');
    expect(component.form.get('idDocument')?.value).toBe('');
  });

  it('should emit formCancel when cancel is clicked', () => {
    spyOn(component.formCancel, 'emit');
    
    component.onCancel();
    
    expect(component.formCancel.emit).toHaveBeenCalled();
  });

  it('should reset form when cancel is clicked', () => {
    component.form.patchValue({
      firstName: 'Juan',
      lastName: 'Pérez',
      idDocument: 'ABC123'
    });
    
    component.onCancel();
    
    expect(component.form.get('firstName')?.value).toBe('');
  });

  it('should validate firstName with pattern', () => {
    const firstNameControl = component.form.get('firstName');
    
    firstNameControl?.setValue('Juan123');
    expect(firstNameControl?.hasError('pattern')).toBe(true);
    
    firstNameControl?.setValue('Juan');
    expect(firstNameControl?.hasError('pattern')).toBeFalsy();
  });

  it('should validate idDocument with pattern', () => {
    const idDocumentControl = component.form.get('idDocument');
    
    idDocumentControl?.setValue('ABC-123');
    expect(idDocumentControl?.hasError('pattern')).toBe(true);
    
    idDocumentControl?.setValue('ABC123');
    expect(idDocumentControl?.hasError('pattern')).toBeFalsy();
  });

  it('should return correct error messages', () => {
    const firstNameControl = component.form.get('firstName');
    firstNameControl?.setValue('');
    firstNameControl?.markAsTouched();
    
    expect(component.getFieldError('firstName')).toBe('Este campo es obligatorio');
    
    firstNameControl?.setValue('A');
    expect(component.getFieldError('firstName')).toContain('Mínimo');
  });

  it('should correctly identify field validity', () => {
    const firstNameControl = component.form.get('firstName');
    firstNameControl?.setValue('');
    firstNameControl?.markAsTouched();
    
    expect(component.isFieldInvalid('firstName')).toBe(true);
    
    firstNameControl?.setValue('Juan');
    expect(component.isFieldInvalid('firstName')).toBe(false);
  });
});
