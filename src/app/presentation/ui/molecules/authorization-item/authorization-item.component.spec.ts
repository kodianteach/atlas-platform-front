import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorizationItemComponent } from './authorization-item.component';
import { Authorization } from '../../../models/authorization.model';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ToggleSwitchComponent } from '../../atoms/toggle-switch/toggle-switch.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AuthorizationItemComponent', () => {
  let component: AuthorizationItemComponent;
  let fixture: ComponentFixture<AuthorizationItemComponent>;

  const mockPermanentAuthorization: Authorization = {
    id: '1',
    name: 'Family Member',
    type: 'permanent',
    isActive: true,
    icon: 'person',
    details: {
      accessType: 'Permanent Access',
      permissions: 'Full Permissions'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  const mockScheduledAuthorization: Authorization = {
    id: '2',
    name: 'Cleaning Service',
    type: 'scheduled',
    isActive: false,
    icon: 'cleaning',
    details: {
      schedule: {
        days: ['Mon', 'Wed', 'Fri'],
        timeRange: '09:00 AM - 02:00 PM'
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizationItemComponent, IconComponent, ToggleSwitchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorizationItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.authorization = mockPermanentAuthorization;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Permanent Authorization Display', () => {
    beforeEach(() => {
      component.authorization = mockPermanentAuthorization;
      component.isActive = true;
      fixture.detectChanges();
    });

    it('should display authorization name', () => {
      const nameElement = fixture.debugElement.query(By.css('.authorization-name'));
      expect(nameElement.nativeElement.textContent).toBe('Family Member');
    });

    it('should display icon component with correct name', () => {
      const iconComponent = fixture.debugElement.query(By.directive(IconComponent));
      expect(iconComponent).toBeTruthy();
      expect(iconComponent.componentInstance.name).toBe('person');
    });

    it('should display permanent access details', () => {
      const detailsElement = fixture.debugElement.query(By.css('.authorization-details'));
      const detailTexts = detailsElement.nativeElement.textContent;
      expect(detailTexts).toContain('Permanent Access');
      expect(detailTexts).toContain('Full Permissions');
    });

    it('should not display scheduled details for permanent authorization', () => {
      expect(component.isScheduled).toBe(false);
      expect(component.isPermanent).toBe(true);
    });
  });

  describe('Scheduled Authorization Display', () => {
    beforeEach(() => {
      component.authorization = mockScheduledAuthorization;
      component.isActive = false;
      fixture.detectChanges();
    });

    it('should display authorization name', () => {
      const nameElement = fixture.debugElement.query(By.css('.authorization-name'));
      expect(nameElement.nativeElement.textContent).toBe('Cleaning Service');
    });

    it('should display scheduled access details with days and time', () => {
      const detailsElement = fixture.debugElement.query(By.css('.authorization-details'));
      const detailText = detailsElement.nativeElement.textContent.trim();
      expect(detailText).toContain('Mon, Wed, Fri');
      expect(detailText).toContain('09:00 AM - 02:00 PM');
    });

    it('should format schedule display correctly', () => {
      expect(component.scheduleDisplay).toBe('Mon, Wed, Fri • 09:00 AM - 02:00 PM');
    });

    it('should not display permanent details for scheduled authorization', () => {
      expect(component.isPermanent).toBe(false);
      expect(component.isScheduled).toBe(true);
    });
  });

  describe('Toggle Switch Integration', () => {
    beforeEach(() => {
      component.authorization = mockPermanentAuthorization;
      component.isActive = true;
      fixture.detectChanges();
    });

    it('should render toggle switch with correct checked state', () => {
      const toggleComponent = fixture.debugElement.query(By.directive(ToggleSwitchComponent));
      expect(toggleComponent).toBeTruthy();
      expect(toggleComponent.componentInstance.checked).toBe(true);
    });

    it('should emit toggle event when toggle switch changes', () => {
      spyOn(component.toggle, 'emit');
      component.onToggle();
      expect(component.toggle.emit).toHaveBeenCalled();
    });

    it('should have appropriate aria-label for toggle switch', () => {
      const toggleComponent = fixture.debugElement.query(By.directive(ToggleSwitchComponent));
      expect(toggleComponent.componentInstance.ariaLabel).toBe('Toggle Family Member authorization');
    });
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      component.authorization = mockPermanentAuthorization;
      component.isActive = true;
      fixture.detectChanges();
    });

    // role="listitem" removed - now handled by parent list container

    it('should contain all required sections', () => {
      const content = fixture.debugElement.query(By.css('.authorization-content'));
      const icon = fixture.debugElement.query(By.css('.authorization-icon'));
      const info = fixture.debugElement.query(By.css('.authorization-info'));
      const toggle = fixture.debugElement.query(By.css('.authorization-toggle'));

      expect(content).toBeTruthy();
      expect(icon).toBeTruthy();
      expect(info).toBeTruthy();
      expect(toggle).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle scheduled authorization without schedule details', () => {
      const authWithoutSchedule: Authorization = {
        ...mockScheduledAuthorization,
        details: {}
      };
      component.authorization = authWithoutSchedule;
      fixture.detectChanges();

      expect(component.scheduleDisplay).toBe('');
    });

    it('should handle authorization with empty name', () => {
      const authWithEmptyName: Authorization = {
        ...mockPermanentAuthorization,
        name: ''
      };
      component.authorization = authWithEmptyName;
      fixture.detectChanges();

      const nameElement = fixture.debugElement.query(By.css('.authorization-name'));
      expect(nameElement.nativeElement.textContent).toBe('');
    });
  });
});
