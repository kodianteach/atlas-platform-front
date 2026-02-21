import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AnnouncementsHeaderComponent } from './announcements-header.component';

describe('AnnouncementsHeaderComponent', () => {
  let component: AnnouncementsHeaderComponent;
  let fixture: ComponentFixture<AnnouncementsHeaderComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementsHeaderComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Title rendering', () => {
    it('should display default title "Announcements"', () => {
      const titleElement = compiled.querySelector('.header-title');
      expect(titleElement?.textContent?.trim()).toBe('Announcements');
    });

    it('should display custom title when provided', () => {
      component.title = 'Custom Title';
      fixture.detectChanges();
      
      const titleElement = compiled.querySelector('.header-title');
      expect(titleElement?.textContent?.trim()).toBe('Custom Title');
    });
  });

  describe('Back button', () => {
    it('should show back button by default', () => {
      const backButton = compiled.querySelector('.back-button');
      expect(backButton).toBeTruthy();
    });

    // showBackButton and backClick removed - tests no longer applicable
  });

  describe('Notification button', () => {
    it('should show notification button by default', () => {
      const notificationButton = compiled.querySelector('.notification-button');
      expect(notificationButton).toBeTruthy();
    });

    it('should hide notification button when showNotificationIcon is false', () => {
      component.showNotificationIcon = false;
      fixture.detectChanges();
      
      const notificationButton = compiled.querySelector('.notification-button');
      expect(notificationButton).toBeFalsy();
    });

    it('should have aria-label "View notifications"', () => {
      const notificationButton = compiled.querySelector('.notification-button');
      expect(notificationButton?.getAttribute('aria-label')).toBe('View notifications');
    });

    it('should emit notificationClick event when clicked', () => {
      spyOn(component.notificationClick, 'emit');
      
      const notificationButton = compiled.querySelector('.notification-button') as HTMLButtonElement;
      notificationButton.click();
      
      expect(component.notificationClick.emit).toHaveBeenCalledWith();
    });
  });

  describe('Layout', () => {
    it('should render header element', () => {
      const header = compiled.querySelector('.announcements-header');
      expect(header).toBeTruthy();
    });

    it('should have all three elements when both buttons are shown', () => {
      const backButton = compiled.querySelector('.back-button');
      const title = compiled.querySelector('.header-title');
      const notificationButton = compiled.querySelector('.notification-button');
      
      expect(backButton).toBeTruthy();
      expect(title).toBeTruthy();
      expect(notificationButton).toBeTruthy();
    });

    it('should maintain title when notification icon is hidden', () => {
      component.showNotificationIcon = false;
      fixture.detectChanges();
      
      const title = compiled.querySelector('.header-title');
      expect(title).toBeTruthy();
      expect(title?.textContent?.trim()).toBe('Announcements');
    });
  });

  describe('Accessibility', () => {
    it('should have proper button types', () => {
      const backButton = compiled.querySelector('.back-button');
      const notificationButton = compiled.querySelector('.notification-button');
      
      expect(backButton?.getAttribute('type')).toBe('button');
      expect(notificationButton?.getAttribute('type')).toBe('button');
    });

    it('should have SVG icons in buttons', () => {
      const notificationButtonSvg = compiled.querySelector('.notification-button svg');
      
      expect(notificationButtonSvg).toBeTruthy();
    });
  });
});
