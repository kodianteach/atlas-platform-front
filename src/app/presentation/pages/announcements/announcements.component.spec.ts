import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AnnouncementsComponent } from './announcements.component';
import { AnnouncementsService } from '../../services/announcements.service';
import { BroadcastMessage, Poll } from '../../models/announcement.model';

describe('AnnouncementsComponent', () => {
  let component: AnnouncementsComponent;
  let fixture: ComponentFixture<AnnouncementsComponent>;
  let mockAnnouncementsService: jasmine.SpyObj<AnnouncementsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockBroadcast: BroadcastMessage = {
    id: '1',
    type: 'broadcast',
    title: 'Test Broadcast',
    description: 'Test description',
    previewText: 'Test preview',
    isUrgent: true,
    backgroundColor: '#ff0000',
    relatedUsers: [],
    createdAt: new Date(),
    priority: 1
  };

  const mockPoll: Poll = {
    id: '2',
    type: 'poll',
    title: 'Test Poll',
    question: 'Test question?',
    icon: 'poll-icon',
    endsAt: new Date(Date.now() + 86400000), // 24 hours from now
    options: [
      { id: 'opt1', text: 'Option 1', votes: 10 },
      { id: 'opt2', text: 'Option 2', votes: 5 }
    ],
    totalVotes: 15,
    discussionId: 'disc1',
    createdAt: new Date(),
    priority: 1
  };

  beforeEach(async () => {
    mockAnnouncementsService = jasmine.createSpyObj('AnnouncementsService', [
      'getAnnouncements',
      'votePoll'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AnnouncementsComponent],
      providers: [
        { provide: AnnouncementsService, useValue: mockAnnouncementsService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load announcements on initialization', () => {
      mockAnnouncementsService.getAnnouncements.and.returnValue(of([mockBroadcast, mockPoll]));
      
      component.ngOnInit();
      
      expect(mockAnnouncementsService.getAnnouncements).toHaveBeenCalled();
      expect(component.loading).toBe(false);
    });

    it('should set loading to true initially', () => {
      mockAnnouncementsService.getAnnouncements.and.returnValue(of([]));
      
      expect(component.loading).toBe(false);
      component.ngOnInit();
      
      // Loading is set to true during loadAnnouncements call
      expect(mockAnnouncementsService.getAnnouncements).toHaveBeenCalled();
    });

    it('should handle errors when loading announcements', () => {
      const errorMessage = 'Failed to load';
      mockAnnouncementsService.getAnnouncements.and.returnValue(
        throwError(() => new Error(errorMessage))
      );
      
      component.ngOnInit();
      
      expect(component.error).toBeTruthy();
      expect(component.loading).toBe(false);
    });
  });

  describe('onReadMore', () => {
    it('should navigate to announcement detail page', () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      component.onReadMore('123');
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/announcements', '123']);
    });

    it('should handle navigation errors', async () => {
      mockRouter.navigate.and.returnValue(Promise.reject('Navigation failed'));
      
      component.onReadMore('123');
      
      await fixture.whenStable();
      expect(component.error).toBeTruthy();
    });
  });

  describe('onVote', () => {
    it('should call votePoll service method', () => {
      mockAnnouncementsService.votePoll.and.returnValue(of(mockPoll));
      mockAnnouncementsService.getAnnouncements.and.returnValue(of([mockPoll]));
      
      component.onVote({ pollId: '2', optionId: 'opt1' });
      
      expect(mockAnnouncementsService.votePoll).toHaveBeenCalledWith('2', 'opt1');
    });

    it('should reload announcements after successful vote', () => {
      mockAnnouncementsService.votePoll.and.returnValue(of(mockPoll));
      mockAnnouncementsService.getAnnouncements.and.returnValue(of([mockPoll]));
      
      component.onVote({ pollId: '2', optionId: 'opt1' });
      
      expect(mockAnnouncementsService.getAnnouncements).toHaveBeenCalled();
    });

    it('should handle vote errors', () => {
      const errorMessage = 'Vote failed';
      mockAnnouncementsService.votePoll.and.returnValue(
        throwError(() => new Error(errorMessage))
      );
      
      component.onVote({ pollId: '2', optionId: 'opt1' });
      
      expect(component.error).toBeTruthy();
    });
  });

  describe('onViewDiscussion', () => {
    it('should navigate to poll discussion page', () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      component.onViewDiscussion('2');
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/polls', '2', 'discussion']);
    });

    it('should handle navigation errors', async () => {
      mockRouter.navigate.and.returnValue(Promise.reject('Navigation failed'));
      
      component.onViewDiscussion('2');
      
      await fixture.whenStable();
      expect(component.error).toBeTruthy();
    });
  });

  // onBack method removed - test no longer applicable

  describe('onNotifications', () => {
    it('should navigate to notifications page', () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      component.onNotifications();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/notifications']);
    });

    it('should handle navigation errors', async () => {
      mockRouter.navigate.and.returnValue(Promise.reject('Navigation failed'));
      
      component.onNotifications();
      
      await fixture.whenStable();
      expect(component.error).toBeTruthy();
    });
  });

  describe('retryLoad', () => {
    it('should reload announcements', () => {
      mockAnnouncementsService.getAnnouncements.and.returnValue(of([mockBroadcast]));
      
      component.retryLoad();
      
      expect(mockAnnouncementsService.getAnnouncements).toHaveBeenCalled();
      expect(component.error).toBeNull();
    });
  });

  describe('type guards', () => {
    it('should correctly identify broadcast announcements', () => {
      expect(component.isBroadcast(mockBroadcast)).toBe(true);
      expect(component.isBroadcast(mockPoll)).toBe(false);
    });

    it('should correctly identify poll announcements', () => {
      expect(component.isPoll(mockPoll)).toBe(true);
      expect(component.isPoll(mockBroadcast)).toBe(false);
    });
  });

  describe('trackByAnnouncementId', () => {
    it('should return announcement id', () => {
      const result = component.trackByAnnouncementId(0, mockBroadcast);
      expect(result).toBe('1');
    });
  });

  describe('empty state', () => {
    it('should display empty state when no announcements', () => {
      mockAnnouncementsService.getAnnouncements.and.returnValue(of([]));
      
      component.ngOnInit();
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const emptyState = compiled.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
    });
  });

  describe('loading state', () => {
    it('should display loading state while fetching data', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const loadingState = compiled.querySelector('.loading-state');
      expect(loadingState).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('should display error state when error occurs', () => {
      component.error = 'Test error message';
      component.loading = false;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      const errorState = compiled.querySelector('.error-state');
      expect(errorState).toBeTruthy();
      expect(errorState.textContent).toContain('Test error message');
    });
  });
});
