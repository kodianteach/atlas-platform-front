/**
 * Announcement data models
 * Defines types for broadcasts, polls, and related entities
 */

/**
 * Base interface for all announcement types
 */
export interface BaseAnnouncement {
  id: string;
  type: 'broadcast' | 'poll';
  createdAt: Date;
  priority: number;
}

/**
 * User information for announcements
 */
export interface AnnouncementUser {
  id: string;
  name: string;
  avatarUrl: string;
}

/**
 * Broadcast message announcement
 */
export interface BroadcastMessage extends BaseAnnouncement {
  type: 'broadcast';
  title: string;
  description: string;
  previewText: string;
  isUrgent: boolean;
  backgroundColor: string;
  relatedUsers: AnnouncementUser[];
}

/**
 * Poll option
 */
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

/**
 * Poll announcement
 */
export interface Poll extends BaseAnnouncement {
  type: 'poll';
  title: string;
  question: string;
  icon: string;
  endsAt: Date;
  options: PollOption[];
  totalVotes: number;
  userVote?: string;
  discussionId: string;
}

/**
 * Announcement type union
 */
export type Announcement = BroadcastMessage | Poll;
