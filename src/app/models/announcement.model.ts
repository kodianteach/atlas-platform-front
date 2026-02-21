/**
 * Data models for the announcements view feature
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
 * Broadcast message announcement
 * Represents important community messages and communications
 */
export interface BroadcastMessage extends BaseAnnouncement {
  type: 'broadcast';
  title: string;
  description: string;
  previewText: string;
  isUrgent: boolean;
  backgroundColor: string;
  relatedUsers: User[];
}

/**
 * Poll announcement
 * Represents interactive polls where users can vote
 */
export interface Poll extends BaseAnnouncement {
  type: 'poll';
  title: string;
  question: string;
  icon: string;
  endsAt: Date;
  options: PollOption[];
  totalVotes: number;
  userVote?: string; // ID of the option voted by the user
  discussionId: string;
}

/**
 * Poll option
 * Represents a single option in a poll
 */
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

/**
 * User information
 * Represents a user in the system
 */
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

/**
 * Discussion
 * Represents a discussion thread associated with a poll
 */
export interface Discussion {
  id: string;
  pollId: string;
  messages: DiscussionMessage[];
}

/**
 * Discussion message
 * Represents a single message in a discussion thread
 */
export interface DiscussionMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
}

/**
 * Announcement type union
 * Can be either a BroadcastMessage or a Poll
 */
export type Announcement = BroadcastMessage | Poll;
