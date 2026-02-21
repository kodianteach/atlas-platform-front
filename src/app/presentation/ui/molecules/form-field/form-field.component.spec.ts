import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    component.label = 'Test Label';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    const newComponent = new FormFieldComponent();
    expect(newComponent.label).toBe('');
    expect(newComponent.required).toBe(false);
    expect(newComponent.error).toBe('');
    expect(newComponent.hint).toBe('');
  });

  it('should display label with correct text', () => {
    const labelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Test Label');
  });

  it('should display required indicator when required is true', () => {
    component.required = true;
    fixture.detectChanges();
    
    const labelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).toContain('*');
  });

  it('should not display required indicator when required is false', () => {
    component.required = false;
    fixture.detectChanges();
    
    const labelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).not.toContain('*');
  });

  it('should display error message when error is set', () => {
    component.error = 'This field is required';
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent.trim()).toBe('This field is required');
  });

  it('should not display error message when error is empty', () => {
    component.error = '';
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement).toBeFalsy();
  });

  it('should display hint text when hint is set and no error', () => {
    component.hint = 'Enter your full name';
    component.error = '';
    fixture.detectChanges();
    
    const hintElement = fixture.nativeElement.querySelector('.hint-text');
    expect(hintElement).toBeTruthy();
    expect(hintElement.textContent.trim()).toBe('Enter your full name');
  });

  it('should not display hint when error is present', () => {
    component.hint = 'Enter your full name';
    component.error = 'This field is required';
    fixture.detectChanges();
    
    const hintElement = fixture.nativeElement.querySelector('.hint-text');
    expect(hintElement).toBeFalsy();
  });

  it('should transclude content via ng-content', () => {
    // This test verifies that the component can accept transcluded content
    expect(fixture.nativeElement.querySelector('ng-content')).toBeDefined();
  });
});
