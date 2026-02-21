import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent, ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Title Display', () => {
    it('should display the provided title', () => {
      component.title = 'Access Permissions';
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('.header-title'));
      expect(titleElement.nativeElement.textContent).toContain('Access Permissions');
    });

    it('should display empty string when no title provided', () => {
      component.title = '';
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('.header-title'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('');
    });
  });

  describe('Back Button', () => {
    it('should show back button when showBackButton is true', () => {
      component.showBackButton = true;
      fixture.detectChanges();

      const backButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const backButton = backButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'Go back to previous page'
      );
      expect(backButton).toBeTruthy();
    });

    it('should not show back button when showBackButton is false', () => {
      component.showBackButton = false;
      fixture.detectChanges();

      const backButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const backButton = backButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'Go back to previous page'
      );
      expect(backButton).toBeFalsy();
    });

    it('should emit backClick event when back button is clicked', () => {
      component.showBackButton = true;
      fixture.detectChanges();

      spyOn(component.backClick, 'emit');

      const backButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const backButton = backButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'Go back to previous page'
      );
      
      backButton?.componentInstance.click.emit();
      
      expect(component.backClick.emit).toHaveBeenCalled();
    });

    it('should have proper ARIA label for back button', () => {
      component.showBackButton = true;
      fixture.detectChanges();

      const backButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const backButton = backButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'Go back to previous page'
      );
      
      expect(backButton?.nativeElement.getAttribute('aria-label')).toBe('Go back to previous page');
    });
  });

  describe('History Button', () => {
    it('should show history button when showHistoryButton is true', () => {
      component.showHistoryButton = true;
      fixture.detectChanges();

      const historyButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const historyButton = historyButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'View authorization history'
      );
      expect(historyButton).toBeTruthy();
    });

    it('should not show history button when showHistoryButton is false', () => {
      component.showHistoryButton = false;
      fixture.detectChanges();

      const historyButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const historyButton = historyButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'View authorization history'
      );
      expect(historyButton).toBeFalsy();
    });

    it('should emit historyClick event when history button is clicked', () => {
      component.showHistoryButton = true;
      fixture.detectChanges();

      spyOn(component.historyClick, 'emit');

      const historyButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const historyButton = historyButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'View authorization history'
      );
      
      historyButton?.componentInstance.click.emit();
      
      expect(component.historyClick.emit).toHaveBeenCalled();
    });

    it('should have proper ARIA label for history button', () => {
      component.showHistoryButton = true;
      fixture.detectChanges();

      const historyButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const historyButton = historyButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'View authorization history'
      );
      
      expect(historyButton?.nativeElement.getAttribute('aria-label')).toBe('View authorization history');
    });
  });

  describe('Both Buttons', () => {
    it('should show both buttons when both flags are true', () => {
      component.showBackButton = true;
      component.showHistoryButton = true;
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      expect(buttons.length).toBe(2);
    });

    it('should show no buttons when both flags are false', () => {
      component.showBackButton = false;
      component.showHistoryButton = false;
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      expect(buttons.length).toBe(0);
    });
  });

  describe('Button Composition', () => {
    it('should compose ButtonAtom components with correct props for back button', () => {
      component.showBackButton = true;
      fixture.detectChanges();

      const backButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const backButton = backButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'Go back to previous page'
      );
      
      expect(backButton?.componentInstance.icon).toBe('arrow-left');
      expect(backButton?.componentInstance.variant).toBe('secondary');
      expect(backButton?.componentInstance.label).toBe('');
    });

    it('should compose ButtonAtom components with correct props for history button', () => {
      component.showHistoryButton = true;
      fixture.detectChanges();

      const historyButtons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
      const historyButton = historyButtons.find(btn => 
        btn.nativeElement.getAttribute('aria-label') === 'View authorization history'
      );
      
      expect(historyButton?.componentInstance.icon).toBe('clock');
      expect(historyButton?.componentInstance.variant).toBe('secondary');
      expect(historyButton?.componentInstance.label).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have header element with proper semantic structure', () => {
      const headerElement = fixture.debugElement.query(By.css('header'));
      expect(headerElement).toBeTruthy();
    });

    it('should have h1 element for title', () => {
      component.title = 'Test Title';
      fixture.detectChanges();

      const h1Element = fixture.debugElement.query(By.css('h1'));
      expect(h1Element).toBeTruthy();
      expect(h1Element.nativeElement.textContent).toContain('Test Title');
    });
  });
});
