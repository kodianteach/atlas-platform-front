import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollOptionComponent } from './poll-option.component';
import { PollOption } from '../../../models/announcement.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PollOptionComponent', () => {
  let component: PollOptionComponent;
  let fixture: ComponentFixture<PollOptionComponent>;

  const mockOption: PollOption = {
    id: 'option-1',
    text: 'Option A',
    votes: 25
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollOptionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('percentage calculation', () => {
    it('should return 0 when totalVotes is 0', () => {
      component.option = mockOption;
      component.totalVotes = 0;
      expect(component.percentage).toBe(0);
    });

    it('should calculate percentage correctly', () => {
      component.option = mockOption;
      component.totalVotes = 100;
      // 25 / 100 * 100 = 25%
      expect(component.percentage).toBe(25);
    });

    it('should round percentage to one decimal place', () => {
      component.option = { ...mockOption, votes: 33 };
      component.totalVotes = 100;
      // 33 / 100 * 100 = 33.0%
      expect(component.percentage).toBe(33);
    });

    it('should handle fractional percentages correctly', () => {
      component.option = { ...mockOption, votes: 1 };
      component.totalVotes = 3;
      // 1 / 3 * 100 = 33.333... -> 33.3%
      expect(component.percentage).toBe(33.3);
    });
  });

  describe('rendering', () => {
    beforeEach(() => {
      component.option = mockOption;
      component.totalVotes = 100;
      component.isSelected = false;
      fixture.detectChanges();
    });

    it('should display option text', () => {
      const textElement = fixture.debugElement.query(By.css('.option-text'));
      expect(textElement.nativeElement.textContent).toBe('Option A');
    });

    it('should display percentage', () => {
      const percentageElement = fixture.debugElement.query(By.css('.option-percentage'));
      expect(percentageElement.nativeElement.textContent).toBe('25%');
    });

    it('should display vote count with singular form', () => {
      component.option = { ...mockOption, votes: 1 };
      fixture.detectChanges();
      const votesElement = fixture.debugElement.query(By.css('.option-votes'));
      expect(votesElement.nativeElement.textContent.trim()).toBe('1 vote');
    });

    it('should display vote count with plural form', () => {
      const votesElement = fixture.debugElement.query(By.css('.option-votes'));
      expect(votesElement.nativeElement.textContent.trim()).toBe('25 votes');
    });

    it('should render progress bar component', () => {
      const progressBar = fixture.debugElement.query(By.css('app-progress-bar'));
      expect(progressBar).toBeTruthy();
    });

    it('should apply selected class when isSelected is true', () => {
      component.isSelected = true;
      fixture.detectChanges();
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      expect(pollOption.nativeElement.classList.contains('selected')).toBe(true);
    });

    it('should not apply selected class when isSelected is false', () => {
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      expect(pollOption.nativeElement.classList.contains('selected')).toBe(false);
    });
  });

  describe('event emission', () => {
    beforeEach(() => {
      component.option = mockOption;
      component.totalVotes = 100;
      fixture.detectChanges();
    });

    it('should emit optionClick with option id when clicked', () => {
      spyOn(component.optionClick, 'emit');
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      pollOption.nativeElement.click();
      expect(component.optionClick.emit).toHaveBeenCalledWith('option-1');
    });

    it('should emit optionClick when Enter key is pressed', () => {
      spyOn(component.optionClick, 'emit');
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      pollOption.nativeElement.dispatchEvent(event);
      expect(component.optionClick.emit).toHaveBeenCalledWith('option-1');
    });

    it('should emit optionClick when Space key is pressed', () => {
      spyOn(component.optionClick, 'emit');
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      const event = new KeyboardEvent('keydown', { key: ' ' });
      pollOption.nativeElement.dispatchEvent(event);
      expect(component.optionClick.emit).toHaveBeenCalledWith('option-1');
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      component.option = mockOption;
      component.totalVotes = 100;
      component.isSelected = false;
      fixture.detectChanges();
    });

    it('should have role="button"', () => {
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      expect(pollOption.nativeElement.getAttribute('role')).toBe('button');
    });

    it('should have tabindex="0"', () => {
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      expect(pollOption.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should have aria-pressed="false" when not selected', () => {
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      expect(pollOption.nativeElement.getAttribute('aria-pressed')).toBe('false');
    });

    it('should have aria-pressed="true" when selected', () => {
      component.isSelected = true;
      fixture.detectChanges();
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      expect(pollOption.nativeElement.getAttribute('aria-pressed')).toBe('true');
    });

    it('should have descriptive aria-label', () => {
      const pollOption = fixture.debugElement.query(By.css('.poll-option'));
      expect(pollOption.nativeElement.getAttribute('aria-label')).toBe('Vote for Option A');
    });
  });

  describe('progress bar integration', () => {
    beforeEach(() => {
      component.option = mockOption;
      component.totalVotes = 100;
      fixture.detectChanges();
    });

    it('should pass percentage to progress bar', () => {
      const progressBar = fixture.debugElement.query(By.css('app-progress-bar'));
      expect(progressBar.componentInstance.percentage).toBe(25);
    });

    it('should pass selected color when isSelected is true', () => {
      component.isSelected = true;
      fixture.detectChanges();
      const progressBar = fixture.debugElement.query(By.css('app-progress-bar'));
      expect(progressBar.componentInstance.color).toBe('#007bff');
    });

    it('should pass default color when isSelected is false', () => {
      const progressBar = fixture.debugElement.query(By.css('app-progress-bar'));
      expect(progressBar.componentInstance.color).toBe('#e0e0e0');
    });

    it('should pass height to progress bar', () => {
      const progressBar = fixture.debugElement.query(By.css('app-progress-bar'));
      expect(progressBar.componentInstance.height).toBe('8px');
    });
  });
});
