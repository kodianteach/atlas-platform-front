import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimestampDisplayComponent } from './timestamp-display.component';

describe('TimestampDisplayComponent', () => {
  let component: TimestampDisplayComponent;
  let fixture: ComponentFixture<TimestampDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimestampDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimestampDisplayComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formattedTime getter', () => {
    it('should format today\'s date with "Today" prefix', () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 30);
      component.timestamp = today;
      
      const result = component.formattedTime;
      
      expect(result).toContain('Today');
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });

    it('should format yesterday\'s date with "Yesterday" prefix', () => {
      const now = new Date();
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 10, 15);
      component.timestamp = yesterday;
      
      const result = component.formattedTime;
      
      expect(result).toContain('Yesterday');
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });

    it('should format older dates with full date', () => {
      const oldDate = new Date(2024, 0, 15, 9, 45); // Jan 15, 2024
      component.timestamp = oldDate;
      
      const result = component.formattedTime;
      
      expect(result).toContain('Jan 15, 2024');
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });
  });

  describe('formatTime12Hour', () => {
    it('should format morning time with AM', () => {
      const morningDate = new Date(2024, 0, 1, 9, 30);
      component.timestamp = morningDate;
      
      const result = component.formattedTime;
      
      expect(result).toContain('9:30 AM');
    });

    it('should format afternoon time with PM', () => {
      const afternoonDate = new Date(2024, 0, 1, 14, 45);
      component.timestamp = afternoonDate;
      
      const result = component.formattedTime;
      
      expect(result).toContain('2:45 PM');
    });

    it('should format midnight as 12:00 AM', () => {
      const midnight = new Date(2024, 0, 1, 0, 0);
      component.timestamp = midnight;
      
      const result = component.formattedTime;
      
      expect(result).toContain('12:00 AM');
    });

    it('should format noon as 12:00 PM', () => {
      const noon = new Date(2024, 0, 1, 12, 0);
      component.timestamp = noon;
      
      const result = component.formattedTime;
      
      expect(result).toContain('12:00 PM');
    });

    it('should pad minutes with leading zero', () => {
      const dateWithSingleDigitMinutes = new Date(2024, 0, 1, 10, 5);
      component.timestamp = dateWithSingleDigitMinutes;
      
      const result = component.formattedTime;
      
      expect(result).toContain('10:05 AM');
    });
  });

  describe('formatDate', () => {
    it('should format date with abbreviated month name', () => {
      const date = new Date(2024, 5, 20, 10, 0); // June 20, 2024
      component.timestamp = date;
      
      const result = component.formattedTime;
      
      expect(result).toContain('Jun 20, 2024');
    });

    it('should format December correctly', () => {
      const date = new Date(2023, 11, 25, 10, 0); // Dec 25, 2023
      component.timestamp = date;
      
      const result = component.formattedTime;
      
      expect(result).toContain('Dec 25, 2023');
    });
  });

  describe('rendering', () => {
    it('should render the formatted timestamp in the template', () => {
      const testDate = new Date(2024, 0, 15, 14, 30);
      component.timestamp = testDate;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const timestampElement = compiled.querySelector('.timestamp');
      
      expect(timestampElement).toBeTruthy();
      expect(timestampElement?.textContent).toContain('Jan 15, 2024');
      expect(timestampElement?.textContent).toContain('2:30 PM');
    });
  });
});
