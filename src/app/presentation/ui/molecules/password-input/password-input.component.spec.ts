import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordInputComponent } from './password-input.component';

describe('PasswordInputComponent', () => {
  let component: PasswordInputComponent;
  let fixture: ComponentFixture<PasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default type as password', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('password');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);
    
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);
    
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(false);
  });

  it('should change input type when toggling visibility', () => {
    const input = fixture.nativeElement.querySelector('input');
    
    expect(input.type).toBe('password');
    
    component.togglePasswordVisibility();
    fixture.detectChanges();
    expect(input.type).toBe('text');
    
    component.togglePasswordVisibility();
    fixture.detectChanges();
    expect(input.type).toBe('password');
  });

  it('should emit valueChange when input value changes', () => {
    let emittedValue = '';
    component.valueChange.subscribe(value => emittedValue = value);
    
    component.onValueChange('test123');
    expect(emittedValue).toBe('test123');
  });

  it('should emit blurred when input loses focus', () => {
    let blurred = false;
    component.blurred.subscribe(() => blurred = true);
    
    component.onBlur();
    expect(blurred).toBe(true);
  });

  it('should display error message when provided', () => {
    fixture.componentRef.setInput('errorMessage', 'Password is required');
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.password-input__error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent.trim()).toBe('Password is required');
  });

  it('should display hint when provided and no error', () => {
    fixture.componentRef.setInput('hint', 'Use at least 8 characters');
    fixture.detectChanges();
    
    const hintElement = fixture.nativeElement.querySelector('.password-input__hint');
    expect(hintElement).toBeTruthy();
    expect(hintElement.textContent.trim()).toBe('Use at least 8 characters');
  });

  it('should show required indicator when required is true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.componentRef.setInput('label', 'Password');
    fixture.detectChanges();
    
    const requiredIndicator = fixture.nativeElement.querySelector('.password-input__required');
    expect(requiredIndicator).toBeTruthy();
    expect(requiredIndicator.textContent).toBe('*');
  });

  it('should disable input when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    
    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });
});
