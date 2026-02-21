import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnnouncementsService } from './announcements.service';
import {
  Announcement,
  BroadcastMessage,
  Poll,
  Discussion
} from '../models/announcement.model';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/announcements';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnnouncementsService]
    });
    service = TestBed.inject(AnnouncementsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAnnouncements', () => {
    it('should retrieve announcements from the API', () => {
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          type: 'broadcast',
          title: 'Test Broadcast',
          description: 'Test description',
          previewText: 'Test preview',
          isUrgent: true,
          backgroundColor: '#ff0000',
          relatedUsers: [],
          createdAt: new Date('2024-01-01'),
          priority: 1
        } as BroadcastMessage,
        {
          id: '2',
          type: 'poll',
          title: 'Test Poll',
          question: 'Test question?',
          icon: 'poll-icon',
          endsAt: new Date('2024-12-31'),
          options: [],
          totalVotes: 0,
          discussionId: 'disc-1',
          createdAt: new Date('2024-01-02'),
          priority: 0
        } as Poll
      ];

      service.getAnnouncements().subscribe(announcements => {
        expect(announcements.length).toBe(2);
        expect(announcements[0].type).toBe('broadcast');
        expect(announcements[1].type).toBe('poll');
        expect(announcements[0].createdAt instanceof Date).toBe(true);
        expect(announcements[1].createdAt instanceof Date).toBe(true);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockAnnouncements);
    });

    it('should handle HTTP errors gracefully', () => {
      service.getAnnouncements().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.message).toContain('Server error');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network errors', () => {
      service.getAnnouncements().subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error.message).toContain('Network error');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('getBroadcastById', () => {
    it('should retrieve a specific broadcast by ID', () => {
      const mockBroadcast: BroadcastMessage = {
        id: '1',
        type: 'broadcast',
        title: 'Test Broadcast',
        description: 'Full description',
        previewText: 'Preview',
        isUrgent: false,
        backgroundColor: '#00ff00',
        relatedUsers: [],
        createdAt: new Date('2024-01-01'),
        priority: 1
      };

      service.getBroadcastById('1').subscribe(broadcast => {
        expect(broadcast.id).toBe('1');
        expect(broadcast.title).toBe('Test Broadcast');
        expect(broadcast.createdAt instanceof Date).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/broadcasts/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBroadcast);
    });

    it('should handle 404 error when broadcast not found', () => {
      service.getBroadcastById('999').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.message).toContain('not found');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/broadcasts/999`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('votePoll', () => {
    it('should send vote request with correct data', () => {
      const mockPoll: Poll = {
        id: '1',
        type: 'poll',
        title: 'Test Poll',
        question: 'Test question?',
        icon: 'poll-icon',
        endsAt: new Date('2024-12-31'),
        options: [
          { id: 'opt-1', text: 'Option 1', votes: 5 },
          { id: 'opt-2', text: 'Option 2', votes: 3 }
        ],
        totalVotes: 8,
        userVote: 'opt-1',
        discussionId: 'disc-1',
        createdAt: new Date('2024-01-01'),
        priority: 0
      };

      service.votePoll('1', 'opt-1').subscribe(poll => {
        expect(poll.id).toBe('1');
        expect(poll.totalVotes).toBe(8);
        expect(poll.userVote).toBe('opt-1');
        expect(poll.createdAt instanceof Date).toBe(true);
        expect(poll.endsAt instanceof Date).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/polls/1/vote`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ optionId: 'opt-1' });
      req.flush(mockPoll);
    });

    it('should handle 409 conflict error when user already voted', () => {
      service.votePoll('1', 'opt-1').subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error) => {
          expect(error.message).toContain('already voted');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/polls/1/vote`);
      req.flush('Already voted', { status: 409, statusText: 'Conflict' });
    });

    it('should handle 401 unauthorized error', () => {
      service.votePoll('1', 'opt-1').subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.message).toContain('Unauthorized');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/polls/1/vote`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('getPollDiscussion', () => {
    it('should retrieve poll discussion with messages', () => {
      const mockDiscussion: Discussion = {
        id: 'disc-1',
        pollId: '1',
        messages: [
          {
            id: 'msg-1',
            userId: 'user-1',
            userName: 'John Doe',
            text: 'Great poll!',
            createdAt: new Date('2024-01-01')
          },
          {
            id: 'msg-2',
            userId: 'user-2',
            userName: 'Jane Smith',
            text: 'I agree!',
            createdAt: new Date('2024-01-02')
          }
        ]
      };

      service.getPollDiscussion('1').subscribe(discussion => {
        expect(discussion.id).toBe('disc-1');
        expect(discussion.pollId).toBe('1');
        expect(discussion.messages.length).toBe(2);
        expect(discussion.messages[0].createdAt instanceof Date).toBe(true);
        expect(discussion.messages[1].createdAt instanceof Date).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/polls/1/discussion`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDiscussion);
    });

    it('should handle empty discussion', () => {
      const mockDiscussion: Discussion = {
        id: 'disc-1',
        pollId: '1',
        messages: []
      };

      service.getPollDiscussion('1').subscribe(discussion => {
        expect(discussion.messages.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/polls/1/discussion`);
      req.flush(mockDiscussion);
    });

    it('should handle 404 error when discussion not found', () => {
      service.getPollDiscussion('999').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.message).toContain('not found');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/polls/999/discussion`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request error', () => {
      service.getAnnouncements().subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.message).toContain('Bad request');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 403 Forbidden error', () => {
      service.getAnnouncements().subscribe({
        next: () => fail('should have failed with 403 error'),
        error: (error) => {
          expect(error.message).toContain('Forbidden');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle unknown error codes', () => {
      service.getAnnouncements().subscribe({
        next: () => fail('should have failed with unknown error'),
        error: (error) => {
          expect(error.message).toContain('Error 418');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('I am a teapot', { status: 418, statusText: 'I am a teapot' });
    });
  });

  describe('sortAnnouncements', () => {
    it('should sort urgent broadcasts before non-urgent broadcasts', () => {
      const now = new Date();
      const announcements: Announcement[] = [
        {
          id: '1',
          type: 'broadcast',
          title: 'Normal Broadcast',
          description: 'Normal',
          previewText: 'Normal',
          isUrgent: false,
          backgroundColor: '#000000',
          relatedUsers: [],
          createdAt: now,
          priority: 0
        } as BroadcastMessage,
        {
          id: '2',
          type: 'broadcast',
          title: 'Urgent Broadcast',
          description: 'Urgent',
          previewText: 'Urgent',
          isUrgent: true,
          backgroundColor: '#ff0000',
          relatedUsers: [],
          createdAt: now,
          priority: 0
        } as BroadcastMessage
      ];

      const sorted = service.sortAnnouncements(announcements);

      expect(sorted[0].id).toBe('2'); // Urgent broadcast should be first
      expect(sorted[1].id).toBe('1');
    });

    it('should sort polls ending soon before polls ending later', () => {
      const now = new Date();
      const soon = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours from now
      const later = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

      const announcements: Announcement[] = [
        {
          id: '1',
          type: 'poll',
          title: 'Poll Ending Later',
          question: 'Question?',
          icon: 'icon',
          endsAt: later,
          options: [],
          totalVotes: 0,
          discussionId: 'disc-1',
          createdAt: now,
          priority: 0
        } as Poll,
        {
          id: '2',
          type: 'poll',
          title: 'Poll Ending Soon',
          question: 'Question?',
          icon: 'icon',
          endsAt: soon,
          options: [],
          totalVotes: 0,
          discussionId: 'disc-2',
          createdAt: now,
          priority: 0
        } as Poll
      ];

      const sorted = service.sortAnnouncements(announcements);

      expect(sorted[0].id).toBe('2'); // Poll ending soon should be first
      expect(sorted[1].id).toBe('1');
    });

    it('should sort by timestamp descending when priority is equal', () => {
      const older = new Date('2024-01-01');
      const newer = new Date('2024-01-02');

      const announcements: Announcement[] = [
        {
          id: '1',
          type: 'broadcast',
          title: 'Older Broadcast',
          description: 'Older',
          previewText: 'Older',
          isUrgent: false,
          backgroundColor: '#000000',
          relatedUsers: [],
          createdAt: older,
          priority: 0
        } as BroadcastMessage,
        {
          id: '2',
          type: 'broadcast',
          title: 'Newer Broadcast',
          description: 'Newer',
          previewText: 'Newer',
          isUrgent: false,
          backgroundColor: '#000000',
          relatedUsers: [],
          createdAt: newer,
          priority: 0
        } as BroadcastMessage
      ];

      const sorted = service.sortAnnouncements(announcements);

      expect(sorted[0].id).toBe('2'); // Newer broadcast should be first
      expect(sorted[1].id).toBe('1');
    });

    it('should prioritize urgent broadcasts over polls ending soon', () => {
      const now = new Date();
      const soon = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours from now

      const announcements: Announcement[] = [
        {
          id: '1',
          type: 'poll',
          title: 'Poll Ending Soon',
          question: 'Question?',
          icon: 'icon',
          endsAt: soon,
          options: [],
          totalVotes: 0,
          discussionId: 'disc-1',
          createdAt: now,
          priority: 0
        } as Poll,
        {
          id: '2',
          type: 'broadcast',
          title: 'Urgent Broadcast',
          description: 'Urgent',
          previewText: 'Urgent',
          isUrgent: true,
          backgroundColor: '#ff0000',
          relatedUsers: [],
          createdAt: now,
          priority: 0
        } as BroadcastMessage
      ];

      const sorted = service.sortAnnouncements(announcements);

      expect(sorted[0].id).toBe('2'); // Urgent broadcast (priority +100) should be first
      expect(sorted[1].id).toBe('1'); // Poll ending soon (priority +50) should be second
    });

    it('should not modify the original array', () => {
      const now = new Date();
      const announcements: Announcement[] = [
        {
          id: '1',
          type: 'broadcast',
          title: 'First',
          description: 'First',
          previewText: 'First',
          isUrgent: false,
          backgroundColor: '#000000',
          relatedUsers: [],
          createdAt: now,
          priority: 0
        } as BroadcastMessage,
        {
          id: '2',
          type: 'broadcast',
          title: 'Second',
          description: 'Second',
          previewText: 'Second',
          isUrgent: true,
          backgroundColor: '#ff0000',
          relatedUsers: [],
          createdAt: now,
          priority: 0
        } as BroadcastMessage
      ];

      const originalFirstId = announcements[0].id;
      service.sortAnnouncements(announcements);

      expect(announcements[0].id).toBe(originalFirstId); // Original array should not be modified
    });

    it('should handle empty array', () => {
      const sorted = service.sortAnnouncements([]);
      expect(sorted.length).toBe(0);
    });

    it('should handle single announcement', () => {
      const now = new Date();
      const announcements: Announcement[] = [
        {
          id: '1',
          type: 'broadcast',
          title: 'Single',
          description: 'Single',
          previewText: 'Single',
          isUrgent: false,
          backgroundColor: '#000000',
          relatedUsers: [],
          createdAt: now,
          priority: 0
        } as BroadcastMessage
      ];

      const sorted = service.sortAnnouncements(announcements);
      expect(sorted.length).toBe(1);
      expect(sorted[0].id).toBe('1');
    });
  });
});
