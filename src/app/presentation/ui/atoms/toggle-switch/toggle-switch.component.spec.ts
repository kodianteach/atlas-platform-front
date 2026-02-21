import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleSwitchComponent } from './toggle-switch.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ToggleSwitchComponent', () => {
  let component: ToggleSwitchComponent;
  let fixture: ComponentFixture<ToggleSwitchComponent>;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleSwitchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleSwitchComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.css('button'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have default checked value as false', () => {
      expect(component.checked).toBe(false);
    });

    it('should have default disabled value as false', () => {
      expect(component.disabled).toBe(false);
    });

    it('should have default ariaLabel', () => {
      expect(component.ariaLabel).toBe('Toggle switch');
    });

    it('should accept checked input', () => {
      component.checked = true;
      fixture.detectChanges();
      expect(component.checked).toBe(true);
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(component.disabled).toBe(true);
    });

    it('should accept custom ariaLabel', () => {
      component.ariaLabel = 'Custom label';
      fixture.detectChanges();
      expect(component.ariaLabel).toBe('Custom label');
    });
  });

  describe('Accessibility', () => {
    it('should have role="switch"', () => {
      const role = buttonElement.nativeElement.getAttribute('role');
      expect(role).toBe('switch');
    });

    it('should have aria-checked attribute matching checked state', () => {
      component.checked = false;
      fixture.detectChanges();
      expect(buttonElement.nativeElement.getAttribute('aria-checked')).toBe('false');

      component.checked = true;
      fixture.detectChanges();
      expect(buttonElement.nativeElement.getAttribute('aria-checked')).toBe('true');
    });

    it('should have aria-label attribute', () => {
      const ariaLabel = buttonElement.nativeElement.getAttribute('aria-label');
      expect(ariaLabel).toBe('Toggle switch');
    });

    it('should use custom aria-label when provided', () => {
      component.ariaLabel = 'Enable notifications';
      fixture.detectChanges();
      const ariaLabel = buttonElement.nativeElement.getAttribute('aria-label');
      expect(ariaLabel).toBe('Enable notifications');
    });

    it('should be focusable via keyboard', () => {
      buttonElement.nativeElement.focus();
      expect(document.activeElement).toBe(buttonElement.nativeElement);
    });

    it('should have disabled attribute when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });
  });

  describe('Toggle Behavior', () => {
    it('should emit change event with true when toggled from false', () => {
      spyOn(component.change, 'emit');
      component.checked = false;
      component.onToggle();
      expect(component.change.emit).toHaveBeenCalledWith(true);
    });

    it('should emit change event with false when toggled from true', () => {
      spyOn(component.change, 'emit');
      component.checked = true;
      component.onToggle();
      expect(component.change.emit).toHaveBeenCalledWith(false);
    });

    it('should toggle checked state on click', () => {
      component.checked = false;
      buttonElement.nativeElement.click();
      expect(component.checked).toBe(true);
    });

    it('should not toggle when disabled', () => {
      component.checked = false;
      component.disabled = true;
      component.onToggle();
      expect(component.checked).toBe(false);
    });

    it('should not emit change event when disabled', () => {
      spyOn(component.change, 'emit');
      component.disabled = true;
      component.onToggle();
      expect(component.change.emit).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should toggle on Enter key press', () => {
      spyOn(component.change, 'emit');
      component.checked = false;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'preventDefault');
      component.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.checked).toBe(true);
      expect(component.change.emit).toHaveBeenCalledWith(true);
    });

    it('should toggle on Space key press', () => {
      spyOn(component.change, 'emit');
      component.checked = false;
      const event = new KeyboardEvent('keydown', { key: ' ' });
      spyOn(event, 'preventDefault');
      component.onKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.checked).toBe(true);
      expect(component.change.emit).toHaveBeenCalledWith(true);
    });

    it('should not toggle on other key press', () => {
      spyOn(component.change, 'emit');
      component.checked = false;
      const event = new KeyboardEvent('keydown', { key: 'a' });
      component.onKeyDown(event);
      expect(component.checked).toBe(false);
      expect(component.change.emit).not.toHaveBeenCalled();
    });

    it('should not toggle on Enter when disabled', () => {
      component.checked = false;
      component.disabled = true;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeyDown(event);
      expect(component.checked).toBe(false);
    });
  });

  describe('CSS Classes', () => {
    it('should apply checked class when checked is true', () => {
      component.checked = true;
      fixture.detectChanges();
      expect(buttonElement.nativeElement.classList.contains('checked')).toBe(true);
    });

    it('should not apply checked class when checked is false', () => {
      component.checked = false;
      fixture.detectChanges();
      expect(buttonElement.nativeElement.classList.contains('checked')).toBe(false);
    });

    it('should apply disabled class when disabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(buttonElement.nativeElement.classList.contains('disabled')).toBe(true);
    });

    it('should not apply disabled class when disabled is false', () => {
      component.disabled = false;
      fixture.detectChanges();
      expect(buttonElement.nativeElement.classList.contains('disabled')).toBe(false);
    });
  });

  describe('Visual Structure', () => {
    it('should render toggle track element', () => {
      const track = fixture.debugElement.query(By.css('.toggle-track'));
      expect(track).toBeTruthy();
    });

    it('should render toggle thumb element', () => {
      const thumb = fixture.debugElement.query(By.css('.toggle-thumb'));
      expect(thumb).toBeTruthy();
    });
  });
});
