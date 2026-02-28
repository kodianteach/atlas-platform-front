import * as fc from 'fast-check';
import {
  userArbitrary,
  pollOptionArbitrary,
  broadcastMessageArbitrary,
  pollArbitrary,
  announcementArbitrary,
  announcementArrayArbitrary,
  discussionMessageArbitrary,
  discussionArbitrary,
  pollWithOptionsArbitrary,
  broadcastWithUsersArbitrary,
  pollEndingInArbitrary,
  userArrayArbitrary,
  postResponseArbitrary,
  commentResponseArbitrary,
  backendNotificationArbitrary,
  runPropertyTest
} from './generators';

describe('Announcement Generators', () => {
  describe('userArbitrary', () => {
    it('should generate valid AnnouncementUser objects', () => {
      runPropertyTest(userArbitrary(), (user) => {
        expect(user.id).toBeTruthy();
        expect(user.name.length).toBeGreaterThan(0);
        expect(user.name.length).toBeLessThanOrEqual(50);
        expect(user.avatarUrl).toContain('http');
      });
    });
  });

  describe('pollOptionArbitrary', () => {
    it('should generate valid PollOption objects', () => {
      runPropertyTest(pollOptionArbitrary(), (option) => {
        expect(typeof option.id).toBe('number');
        expect(option.text.length).toBeGreaterThan(0);
        expect(option.text.length).toBeLessThanOrEqual(100);
        expect(option.votes).toBeGreaterThanOrEqual(0);
        expect(option.votes).toBeLessThanOrEqual(10000);
        expect(typeof option.percentage).toBe('number');
      });
    });
  });

  describe('broadcastMessageArbitrary', () => {
    it('should generate valid BroadcastMessage objects', () => {
      runPropertyTest(broadcastMessageArbitrary(), (broadcast) => {
        expect(typeof broadcast.id).toBe('number');
        expect(broadcast.type).toBe('broadcast');
        expect(typeof broadcast.createdAt).toBe('string');
        expect(broadcast.priority).toBeGreaterThanOrEqual(0);
        expect(broadcast.priority).toBeLessThanOrEqual(10);
        expect(broadcast.title.length).toBeGreaterThan(0);
        expect(broadcast.title.length).toBeLessThanOrEqual(100);
        expect(broadcast.description.length).toBeGreaterThanOrEqual(10);
        expect(broadcast.description.length).toBeLessThanOrEqual(500);
        expect(broadcast.previewText.length).toBeGreaterThanOrEqual(10);
        expect(broadcast.previewText.length).toBeLessThanOrEqual(150);
        expect(typeof broadcast.isUrgent).toBe('boolean');
        expect(typeof broadcast.isPinned).toBe('boolean');
        expect(typeof broadcast.allowComments).toBe('boolean');
        expect(['DRAFT', 'PUBLISHED', 'ARCHIVED']).toContain(broadcast.status);
        expect(['ANNOUNCEMENT', 'NEWS', 'AD']).toContain(broadcast.postType);
        expect(broadcast.backgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(Array.isArray(broadcast.relatedUsers)).toBe(true);
        expect(broadcast.relatedUsers.length).toBeLessThanOrEqual(20);
      });
    });
  });

  describe('pollArbitrary', () => {
    it('should generate valid Poll objects', () => {
      runPropertyTest(pollArbitrary(), (poll) => {
        expect(typeof poll.id).toBe('number');
        expect(poll.type).toBe('poll');
        expect(typeof poll.createdAt).toBe('string');
        expect(poll.priority).toBeGreaterThanOrEqual(0);
        expect(poll.priority).toBeLessThanOrEqual(10);
        expect(poll.title.length).toBeGreaterThan(0);
        expect(poll.title.length).toBeLessThanOrEqual(100);
        expect(poll.question.length).toBeGreaterThanOrEqual(10);
        expect(poll.question.length).toBeLessThanOrEqual(200);
        expect(poll.icon.length).toBeGreaterThan(0);
        expect(['DRAFT', 'ACTIVE', 'CLOSED']).toContain(poll.status);
        expect(Array.isArray(poll.options)).toBe(true);
        expect(poll.options.length).toBeGreaterThanOrEqual(2);
        expect(poll.options.length).toBeLessThanOrEqual(6);
        expect(poll.totalVotes).toBeGreaterThanOrEqual(0);
        expect(poll.discussionId).toBeTruthy();
        expect(typeof poll.allowMultiple).toBe('boolean');
        expect(typeof poll.isAnonymous).toBe('boolean');
      });
    });

    it('should ensure totalVotes equals sum of option votes', () => {
      runPropertyTest(pollArbitrary(), (poll) => {
        const sumOfVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
        expect(poll.totalVotes).toBe(sumOfVotes);
      });
    });
  });

  describe('announcementArbitrary', () => {
    it('should generate valid Announcement objects (broadcast or poll)', () => {
      runPropertyTest(announcementArbitrary(), (announcement) => {
        expect(typeof announcement.id).toBe('number');
        expect(['broadcast', 'poll']).toContain(announcement.type);
        expect(typeof announcement.createdAt).toBe('string');
        expect(announcement.priority).toBeGreaterThanOrEqual(0);
        expect(announcement.priority).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('announcementArrayArbitrary', () => {
    it('should generate arrays of announcements within specified length', () => {
      runPropertyTest(announcementArrayArbitrary(5, 15), (announcements) => {
        expect(Array.isArray(announcements)).toBe(true);
        expect(announcements.length).toBeGreaterThanOrEqual(5);
        expect(announcements.length).toBeLessThanOrEqual(15);
      });
    });
  });

  describe('discussionMessageArbitrary', () => {
    it('should generate valid DiscussionMessage objects', () => {
      runPropertyTest(discussionMessageArbitrary(), (message) => {
        expect(message.id).toBeTruthy();
        expect(message.userId).toBeTruthy();
        expect(message.userName.length).toBeGreaterThan(0);
        expect(message.userName.length).toBeLessThanOrEqual(50);
        expect(message.text.length).toBeGreaterThan(0);
        expect(message.text.length).toBeLessThanOrEqual(500);
        expect(message.createdAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('discussionArbitrary', () => {
    it('should generate valid Discussion objects', () => {
      runPropertyTest(discussionArbitrary(), (discussion) => {
        expect(discussion.id).toBeTruthy();
        expect(discussion.pollId).toBeTruthy();
        expect(Array.isArray(discussion.messages)).toBe(true);
        expect(discussion.messages.length).toBeLessThanOrEqual(50);
      });
    });
  });

  describe('pollWithOptionsArbitrary', () => {
    it('should generate polls with specified number of options', () => {
      runPropertyTest(pollWithOptionsArbitrary(3, 5), (poll) => {
        expect(poll.options.length).toBeGreaterThanOrEqual(3);
        expect(poll.options.length).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('broadcastWithUsersArbitrary', () => {
    it('should generate broadcasts with specified number of users', () => {
      runPropertyTest(broadcastWithUsersArbitrary(2, 8), (broadcast) => {
        expect(broadcast.relatedUsers.length).toBeGreaterThanOrEqual(2);
        expect(broadcast.relatedUsers.length).toBeLessThanOrEqual(8);
      });
    });
  });

  describe('pollEndingInArbitrary', () => {
    it('should generate polls ending within specified time range', () => {
      runPropertyTest(pollEndingInArbitrary(1, 24), (poll) => {
        expect(poll.endsAt).toBeTruthy();
        const now = Date.now();
        const hoursUntilEnd = (new Date(poll.endsAt!).getTime() - now) / (1000 * 60 * 60);
        expect(hoursUntilEnd).toBeGreaterThanOrEqual(1);
        expect(hoursUntilEnd).toBeLessThanOrEqual(24);
      });
    });
  });

  describe('userArrayArbitrary', () => {
    it('should generate arrays of users within specified length', () => {
      runPropertyTest(userArrayArbitrary(3, 10), (users) => {
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThanOrEqual(3);
        expect(users.length).toBeLessThanOrEqual(10);
      });
    });
  });

  // New HU-11 generators
  describe('postResponseArbitrary', () => {
    it('should generate valid PostResponse objects', () => {
      runPropertyTest(postResponseArbitrary(), (post) => {
        expect(typeof post.id).toBe('number');
        expect(typeof post.organizationId).toBe('number');
        expect(typeof post.authorId).toBe('number');
        expect(post.title.length).toBeGreaterThan(0);
        expect(post.title.length).toBeLessThanOrEqual(150);
        expect(post.content.length).toBeGreaterThan(0);
        expect(['ANNOUNCEMENT', 'NEWS', 'AD']).toContain(post.type);
        expect(['DRAFT', 'PUBLISHED', 'ARCHIVED']).toContain(post.status);
        expect(typeof post.allowComments).toBe('boolean');
        expect(typeof post.isPinned).toBe('boolean');
        expect(typeof post.createdAt).toBe('string');
      });
    });
  });

  describe('commentResponseArbitrary', () => {
    it('should generate valid CommentResponse objects', () => {
      runPropertyTest(commentResponseArbitrary(), (comment) => {
        expect(typeof comment.id).toBe('number');
        expect(typeof comment.postId).toBe('number');
        expect(typeof comment.authorId).toBe('number');
        expect(comment.content.length).toBeGreaterThan(0);
        expect(comment.content.length).toBeLessThanOrEqual(1000);
        expect(typeof comment.isApproved).toBe('boolean');
        expect(typeof comment.createdAt).toBe('string');
      });
    });
  });

  describe('backendNotificationArbitrary', () => {
    it('should generate valid BackendNotification objects', () => {
      runPropertyTest(backendNotificationArbitrary(), (notification) => {
        expect(typeof notification.id).toBe('number');
        expect(typeof notification.organizationId).toBe('number');
        expect(notification.title.length).toBeGreaterThan(0);
        expect(notification.message.length).toBeGreaterThan(0);
        expect(['POST_PUBLISHED', 'POLL_ACTIVATED']).toContain(notification.type);
        expect(typeof notification.isRead).toBe('boolean');
        expect(typeof notification.createdAt).toBe('string');
      });
    });
  });
});
