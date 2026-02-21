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
  runPropertyTest
} from './generators';

describe('Announcement Generators', () => {
  describe('userArbitrary', () => {
    it('should generate valid User objects', () => {
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
        expect(option.id).toBeTruthy();
        expect(option.text.length).toBeGreaterThan(0);
        expect(option.text.length).toBeLessThanOrEqual(100);
        expect(option.votes).toBeGreaterThanOrEqual(0);
        expect(option.votes).toBeLessThanOrEqual(10000);
      });
    });
  });

  describe('broadcastMessageArbitrary', () => {
    it('should generate valid BroadcastMessage objects', () => {
      runPropertyTest(broadcastMessageArbitrary(), (broadcast) => {
        expect(broadcast.id).toBeTruthy();
        expect(broadcast.type).toBe('broadcast');
        expect(broadcast.createdAt).toBeInstanceOf(Date);
        expect(broadcast.priority).toBeGreaterThanOrEqual(0);
        expect(broadcast.priority).toBeLessThanOrEqual(10);
        expect(broadcast.title.length).toBeGreaterThan(0);
        expect(broadcast.title.length).toBeLessThanOrEqual(100);
        expect(broadcast.description.length).toBeGreaterThanOrEqual(10);
        expect(broadcast.description.length).toBeLessThanOrEqual(500);
        expect(broadcast.previewText.length).toBeGreaterThanOrEqual(10);
        expect(broadcast.previewText.length).toBeLessThanOrEqual(150);
        expect(typeof broadcast.isUrgent).toBe('boolean');
        expect(broadcast.backgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(Array.isArray(broadcast.relatedUsers)).toBe(true);
        expect(broadcast.relatedUsers.length).toBeLessThanOrEqual(20);
      });
    });
  });

  describe('pollArbitrary', () => {
    it('should generate valid Poll objects', () => {
      runPropertyTest(pollArbitrary(), (poll) => {
        expect(poll.id).toBeTruthy();
        expect(poll.type).toBe('poll');
        expect(poll.createdAt).toBeInstanceOf(Date);
        expect(poll.priority).toBeGreaterThanOrEqual(0);
        expect(poll.priority).toBeLessThanOrEqual(10);
        expect(poll.title.length).toBeGreaterThan(0);
        expect(poll.title.length).toBeLessThanOrEqual(100);
        expect(poll.question.length).toBeGreaterThanOrEqual(10);
        expect(poll.question.length).toBeLessThanOrEqual(200);
        expect(poll.icon.length).toBeGreaterThan(0);
        expect(poll.endsAt).toBeInstanceOf(Date);
        expect(poll.endsAt.getTime()).toBeGreaterThanOrEqual(Date.now());
        expect(Array.isArray(poll.options)).toBe(true);
        expect(poll.options.length).toBeGreaterThanOrEqual(2);
        expect(poll.options.length).toBeLessThanOrEqual(6);
        expect(poll.totalVotes).toBeGreaterThanOrEqual(0);
        expect(poll.discussionId).toBeTruthy();
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
        expect(announcement.id).toBeTruthy();
        expect(['broadcast', 'poll']).toContain(announcement.type);
        expect(announcement.createdAt).toBeInstanceOf(Date);
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
        const now = Date.now();
        const hoursUntilEnd = (poll.endsAt.getTime() - now) / (1000 * 60 * 60);
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
});
