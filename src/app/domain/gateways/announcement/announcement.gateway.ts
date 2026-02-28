/**
 * Announcement Gateway - Abstract interface for announcements
 */
import { Observable } from 'rxjs';
import {
  PostResponse,
  PollResponse,
  PostRequest,
  PollRequest,
  VoteRequest,
  CommentResponse,
  CommentRequest,
  PostPollFilterParams
} from '@domain/models/announcement/announcement.model';
import { Result } from '@domain/models/common/api-response.model';
import { PageResponse } from '@domain/models/common/pagination.model';

export abstract class AnnouncementGateway {
  /**
   * Get all published posts for an organization
   */
  abstract getPosts(organizationId: number): Observable<Result<PostResponse[]>>;

  /**
   * Get all posts (admin view) for an organization
   */
  abstract getAllPosts(organizationId: number): Observable<Result<PostResponse[]>>;

  /**
   * Get a single post by ID
   */
  abstract getPostById(id: number): Observable<Result<PostResponse>>;

  /**
   * Create a new post
   */
  abstract createPost(request: PostRequest): Observable<Result<PostResponse>>;

  /**
   * Update an existing post
   */
  abstract updatePost(id: number, request: PostRequest): Observable<Result<PostResponse>>;

  /**
   * Publish a draft post
   */
  abstract publishPost(id: number): Observable<Result<PostResponse>>;

  /**
   * Archive a post
   */
  abstract archivePost(id: number): Observable<Result<PostResponse>>;

  /**
   * Toggle pin on a post
   */
  abstract togglePinPost(id: number): Observable<Result<PostResponse>>;

  /**
   * Delete a post (soft delete)
   */
  abstract deletePost(id: number): Observable<Result<void>>;

  /**
   * Get all active polls for an organization
   */
  abstract getActivePolls(organizationId: number): Observable<Result<PollResponse[]>>;

  /**
   * Get all polls (admin view) for an organization
   */
  abstract getAllPolls(organizationId: number): Observable<Result<PollResponse[]>>;

  /**
   * Get a single poll by ID with results
   */
  abstract getPollById(id: number): Observable<Result<PollResponse>>;

  /**
   * Create a new poll
   */
  abstract createPoll(request: PollRequest): Observable<Result<PollResponse>>;

  /**
   * Vote on a poll
   */
  abstract votePoll(pollId: number, request: VoteRequest): Observable<Result<void>>;

  /**
   * Activate a draft poll
   */
  abstract activatePoll(id: number): Observable<Result<PollResponse>>;

  /**
   * Close an active poll
   */
  abstract closePoll(id: number): Observable<Result<PollResponse>>;

  /**
   * Get poll results
   */
  abstract getPollResults(id: number): Observable<Result<PollResponse>>;

  /**
   * Get comments for a post
   */
  abstract getComments(postId: number): Observable<Result<CommentResponse[]>>;

  /**
   * Create a comment on a post
   */
  abstract createComment(request: CommentRequest): Observable<Result<CommentResponse>>;

  /**
   * Delete a comment
   */
  abstract deleteComment(id: number): Observable<Result<void>>;

  // ========================
  // ADMIN PANEL
  // ========================

  /**
   * Search posts with filters and pagination (admin)
   */
  abstract searchPosts(filters: PostPollFilterParams): Observable<Result<PageResponse<PostResponse>>>;

  /**
   * Search polls with filters and pagination (admin)
   */
  abstract searchPolls(filters: PostPollFilterParams): Observable<Result<PageResponse<PollResponse>>>;

  /**
   * Get post statistics by status (admin)
   */
  abstract getPostStats(): Observable<Result<Record<string, number>>>;

  /**
   * Get poll statistics by status (admin)
   */
  abstract getPollStats(): Observable<Result<Record<string, number>>>;

  /**
   * Reactivate an archived post (ARCHIVED → PUBLISHED)
   */
  abstract reactivatePost(id: number): Observable<Result<PostResponse>>;

  /**
   * Hide a comment (mark as not approved)
   */
  abstract hideComment(id: number): Observable<Result<CommentResponse>>;

  /**
   * Approve a flagged comment (false positive)
   */
  abstract approveComment(id: number): Observable<Result<CommentResponse>>;

  /**
   * Get flagged comments for an organization
   */
  abstract getFlaggedComments(organizationId: number): Observable<Result<CommentResponse[]>>;

  /**
   * Get all comments for a post including hidden ones (admin view)
   */
  abstract getAllCommentsByPost(postId: number): Observable<Result<CommentResponse[]>>;
}
