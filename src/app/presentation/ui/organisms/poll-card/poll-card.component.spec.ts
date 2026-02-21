import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollCardComponent } from './poll-card.component';
import { Poll, PollOption } from '../../../models/announcement.model';

describe('PollCardComponent', () => {
  let component: PollCardComponent;
  let fixture: ComponentFixture<PollCardComponent>;

  const mockPollOptions: PollOption[] = [
    { id: 'opt1', text: 'Option 1', votes: 10 },
    { id: 'opt2', text: 'Option 2', votes: 5 }
  ];

  const mockPoll: Poll = {
    id: 'poll1',
    type: 'poll',
    createdAt: new Date(),
    priority: 1,
    title: 'Test Poll',
    question: 'What is your favorite color?',
    icon: '🎨',
    endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    options: mockPollOptions,
    totalVotes: 15,
    discussionId: 'disc1'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('poll', mockPoll);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rendering', () => {
    it('should render poll icon', () => {
      const compiled = fixture.nativeElement;
      const icon = compiled.querySelector('.poll-icon .icon');
      expect(icon.textContent).toContain(mockPoll.icon);
    });

    it('should render poll title', () => {
      const compiled = fixture.nativeElement;
      const title = compiled.querySelector('.poll-title');
      expect(title.textContent).toContain(mockPoll.title);
    });

    it('should render poll question', () => {
      const compiled = fixture.nativeElement;
      const question = compiled.querySelector('.poll-question p');
      expect(question.textContent).toContain(mockPoll.question);
    });

    it('should render all poll options', () => {
      const compiled = fixture.nativeElement;
      const options = compiled.querySelectorAll('app-poll-option');
      expect(options.length).toBe(mockPoll.options.length);
    });

    it('should render total votes', () => {
      const compiled = fixture.nativeElement;
      const totalVotes = compiled.querySelector('.total-votes');
      expect(totalVotes.textContent).toContain('15 votes');
    });

    it('should render total votes with singular form when count is 1', () => {
      fixture.componentRef.setInput('poll', { ...mockPoll, totalVotes: 1 });
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const totalVotes = compiled.querySelector('.total-votes');
      expect(totalVotes.textContent).toContain('1 vote');
    });

    it('should render View Discussion button', () => {
      const compiled = fixture.nativeElement;
      const button = compiled.querySelector('.view-discussion-btn');
      expect(button).toBeTruthy();
      expect(button.textContent).toContain('View Discussion');
    });
  });

  describe('getTimeRemaining()', () => {
    it('should return "Ended" when poll has ended', () => {
      fixture.componentRef.setInput('poll', {
        ...mockPoll,
        endsAt: new Date(Date.now() - 1000) // 1 second ago
      });
      expect(component.timeRemaining()).toBe('Ended');
    });

    it('should return days remaining when more than 24 hours left', () => {
      fixture.componentRef.setInput('poll', {
        ...mockPoll,
        endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
      });
      const result = component.timeRemaining();
      expect(result).toContain('Ends in 2 days');
    });

    it('should return day remaining (singular) when exactly 1 day left', () => {
      fixture.componentRef.setInput('poll', {
        ...mockPoll,
        endsAt: new Date(Date.now() + 25 * 60 * 60 * 1000) // 25 hours from now
      });
      const result = component.timeRemaining();
      expect(result).toContain('Ends in 1 day');
    });

    it('should return hours remaining when less than 24 hours but more than 1 hour', () => {
      fixture.componentRef.setInput('poll', {
        ...mockPoll,
        endsAt: new Date(Date.now() + 5 * 60 * 60 * 1000) // 5 hours from now
      });
      const result = component.timeRemaining();
      expect(result).toContain('Ends in 5 hours');
    });

    it('should return hour remaining (singular) when exactly 1 hour left', () => {
      fixture.componentRef.setInput('poll', {
        ...mockPoll,
        endsAt: new Date(Date.now() + 90 * 60 * 1000) // 90 minutes from now
      });
      const result = component.timeRemaining();
      expect(result).toContain('Ends in 1 hour');
    });

    it('should return minutes remaining when less than 1 hour', () => {
      fixture.componentRef.setInput('poll', {
        ...mockPoll,
        endsAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
      });
      const result = component.timeRemaining();
      expect(result).toContain('Ends in 30 minutes');
    });

    it('should return minute remaining (singular) when exactly 1 minute left', () => {
      fixture.componentRef.setInput('poll', {
        ...mockPoll,
        endsAt: new Date(Date.now() + 90 * 1000) // 90 seconds from now
      });
      const result = component.timeRemaining();
      expect(result).toContain('Ends in 1 minute');
    });
  });

  describe('Event Emissions', () => {
    it('should emit voteClick when onVote is called', () => {
      spyOn(component.voteClick, 'emit');
      component.onVote('opt1');
      expect(component.voteClick.emit).toHaveBeenCalledWith({
        pollId: mockPoll.id,
        optionId: 'opt1'
      });
    });

    it('should emit viewDiscussionClick when onViewDiscussion is called', () => {
      spyOn(component.viewDiscussionClick, 'emit');
      component.onViewDiscussion();
      expect(component.viewDiscussionClick.emit).toHaveBeenCalledWith(mockPoll.id);
    });

    it('should emit viewDiscussionClick when View Discussion button is clicked', () => {
      spyOn(component, 'onViewDiscussion');
      const compiled = fixture.nativeElement;
      const button = compiled.querySelector('.view-discussion-btn');
      button.click();
      expect(component.onViewDiscussion).toHaveBeenCalled();
    });
  });

  describe('isOptionSelected()', () => {
    it('should return true when option is selected by user', () => {
      fixture.componentRef.setInput('poll', { ...mockPoll, userVote: 'opt1' });
      expect(component.isOptionSelected('opt1')).toBe(true);
    });

    it('should return false when option is not selected by user', () => {
      fixture.componentRef.setInput('poll', { ...mockPoll, userVote: 'opt1' });
      expect(component.isOptionSelected('opt2')).toBe(false);
    });

    it('should return false when user has not voted', () => {
      fixture.componentRef.setInput('poll', { ...mockPoll, userVote: undefined });
      expect(component.isOptionSelected('opt1')).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have role="article" on the card', () => {
      const compiled = fixture.nativeElement;
      const card = compiled.querySelector('.poll-card');
      expect(card.getAttribute('role')).toBe('article');
    });

    it('should have role="radiogroup" on poll options container', () => {
      const compiled = fixture.nativeElement;
      const optionsContainer = compiled.querySelector('.poll-options');
      expect(optionsContainer.getAttribute('role')).toBe('radiogroup');
    });

    it('should have aria-label on View Discussion button', () => {
      const compiled = fixture.nativeElement;
      const button = compiled.querySelector('.view-discussion-btn');
      expect(button.getAttribute('aria-label')).toBeTruthy();
    });
  });
});
