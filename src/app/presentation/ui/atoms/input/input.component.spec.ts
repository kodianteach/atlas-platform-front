import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.id = 'test-input';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input with correct type', () => {
    component.type = 'email';
    fixture.detectChanges();
    
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.type).toBe('email');
  });

  it('should render input with correct id', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.id).toBe('test-input');
  });

  it('should render input with placeholder', () => {
    component.placeholder = 'Enter text';
    fixture.detectChanges();
    
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.placeholder).toBe('Enter text');
  });

  it('should disable input when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.disabled).toBe(true);
  });

  it('should set aria-invalid when hasError is true', () => {
    component.hasError = true;
    fixture.detectChanges();
    
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.getAttribute('aria-invalid')).toBe('true');
  });

  it('should set aria-describedby when errorId is provided', () => {
    component.errorId = 'error-message';
    fixture.detectChanges();
    
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.getAttribute('aria-describedby')).toBe('error-message');
  });

  it('should emit valueChange on input event', () => {
    spyOn(component.valueChange, 'emit');
    
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'test value';
    inputElement.dispatchEvent(new Event('input'));
    
    expect(component.valueChange.emit).toHaveBeenCalledWith('test value');
  });

  it('should emit focus event and set isFocused to true', () => {
    spyOn(component.focus, 'emit');
    
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.dispatchEvent(new Event('focus'));
    
    expect(component.isFocused).toBe(true);
    expect(component.focus.emit).toHaveBeenCalled();
  });

  it('should emit blur event and set isFocused to false', () => {
    spyOn(component.blur, 'emit');
    component.isFocused = true;
    
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.dispatchEvent(new Event('blur'));
    
    expect(component.isFocused).toBe(false);
    expect(component.blur.emit).toHaveBeenCalled();
  });

  it('should apply input-focused class when focused', () => {
    component.isFocused = true;
    fixture.detectChanges();
    
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.classList.contains('input-focused')).toBe(true);
  });

  it('should apply input-error class when hasError is true', () => {
    component.hasError = true;
    fixture.detectChanges();
    
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.classList.contains('input-error')).toBe(true);
  });
});
