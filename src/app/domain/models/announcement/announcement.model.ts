/**
 * Announcement data models
 * Defines types for broadcasts (posts), polls, comments and related entities.
 * Aligned with backend DTOs: PostResponse, PollResponse, CommentResponse.
 */

/**
 * Base interface for all announcement types
 */
export interface BaseAnnouncement {
  id: number;
  type: 'broadcast' | 'poll';
  createdAt: string;
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

// ================================
// POST / BROADCAST
// ================================

/** Post status from backend */
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/** Post type from backend */
export type PostType = 'ANNOUNCEMENT' | 'NEWS' | 'AD';

/** Backend PostResponse DTO */
export interface PostResponse {
  id: number;
  organizationId: number;
  authorId: number;
  title: string;
  content: string;
  type: PostType;
  allowComments: boolean;
  isPinned: boolean;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  commentsCount: number;
}

/** Frontend-friendly broadcast (mapped from PostResponse) */
export interface BroadcastMessage extends BaseAnnouncement {
  type: 'broadcast';
  title: string;
  description: string;
  previewText: string;
  postType: PostType;
  isPinned: boolean;
  allowComments: boolean;
  status: PostStatus;
  authorId: number;
  organizationId: number;
  publishedAt: string | null;
  isUrgent: boolean;
  backgroundColor: string;
  relatedUsers: AnnouncementUser[];
}

// ================================
// POLL
// ================================

/** Poll status from backend */
export type PollStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';

/** Backend PollOptionResponse DTO */
export interface PollOptionResponse {
  id: number;
  optionText: string;
  sortOrder: number;
  voteCount: number;
  percentage: number;
}

/** Frontend-friendly poll option */
export interface PollOption {
  id: number;
  text: string;
  votes: number;
  percentage: number;
}

/** Backend PollResponse DTO */
export interface PollResponse {
  id: number;
  organizationId: number;
  authorId: number;
  title: string;
  description: string;
  allowMultiple: boolean;
  isAnonymous: boolean;
  status: PollStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  options: PollOptionResponse[];
  totalVotes: number;
}

/** Frontend-friendly poll (mapped from PollResponse) */
export interface Poll extends BaseAnnouncement {
  type: 'poll';
  title: string;
  question: string;
  icon: string;
  status: PollStatus;
  endsAt: string | null;
  options: PollOption[];
  totalVotes: number;
  userVote?: number;
  allowMultiple: boolean;
  isAnonymous: boolean;
  organizationId: number;
  authorId: number;
  discussionId: string;
}

// ================================
// COMMENT
// ================================

/** Backend CommentResponse DTO */
export interface CommentResponse {
  id: number;
  postId: number;
  authorId: number;
  parentId: number | null;
  content: string;
  isApproved: boolean;
  flagReason: string | null;
  authorRole: string | null;
  createdAt: string;
}

/** Frontend-friendly comment */
export interface Comment {
  id: number;
  postId: number;
  authorId: number;
  authorName?: string;
  parentId: number | null;
  content: string;
  isApproved: boolean;
  flagReason: string | null;
  authorRole: string | null;
  createdAt: string;
  replies?: Comment[];
}

// ================================
// REQUEST DTOs
// ================================

/** Create post request */
export interface PostRequest {
  organizationId: number;
  title: string;
  content: string;
  type?: PostType;
  allowComments?: boolean;
}

/** Create poll request */
export interface PollRequest {
  organizationId: number;
  title: string;
  description?: string;
  allowMultiple?: boolean;
  isAnonymous?: boolean;
  options: string[];
}

/** Vote request */
export interface VoteRequest {
  optionId: number;
}

/** Create comment request */
export interface CommentRequest {
  postId: number;
  content: string;
  parentId?: number;
}

// ================================
// ADMIN PANEL DTOs
// ================================

/** Communication stats for admin panel */
export interface CommunicationStatsResponse {
  postsByStatus: Record<string, number>;
  pollsByStatus: Record<string, number>;
  totalComments: number;
  participationRate: number;
}

/** Filter params for admin panel search */
export interface PostPollFilterParams {
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page: number;
  size: number;
}

/**
 * Announcement type union
 */
export type Announcement = BroadcastMessage | Poll;
