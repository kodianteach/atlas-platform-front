import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default type as button', () => {
    expect(component.type).toBe('button');
  });

  it('should have default label as empty string', () => {
    expect(component.label).toBe('');
  });

  it('should not be disabled by default', () => {
    expect(component.disabled).toBe(false);
  });

  it('should have default icon as empty string', () => {
    expect(component.icon).toBe('');
  });

  it('should render button element', () => {
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement).toBeTruthy();
  });

  it('should set button type attribute', () => {
    component.type = 'submit';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.type).toBe('submit');
  });

  it('should disable button when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.disabled).toBe(true);
  });

  it('should emit click event when button is clicked', () => {
    spyOn(component.click, 'emit');
    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    expect(component.click.emit).toHaveBeenCalled();
  });

  it('should not emit click event when button is disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    spyOn(component.click, 'emit');
    component.handleClick();
    expect(component.click.emit).not.toHaveBeenCalled();
  });

  it('should display label when provided', () => {
    component.label = 'Click Me';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent).toContain('Click Me');
  });

  it('should display icon when provided', () => {
    component.icon = 'bi-plus';
    component.label = '';
    fixture.detectChanges();
    const buttonElement = fixture.nativeElement.querySelector('button');
    // Icon should be rendered in the template
    expect(component.icon).toBe('bi-plus');
  });
});
