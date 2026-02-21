/**
 * Comment Mock Service
 * 
 * Provides mock implementations for COMMENT module endpoints including
 * CRUD operations for comments with author information and post filtering.
 * 
 * All methods return Observable<ApiResponse<T>> to match real HTTP service patterns.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse, QueryParams } from './types/api-response.interface';
import { Comment } from './types/entities.interface';
import { CreateCommentRequest, UpdateCommentRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_COMMENTS } from './data/mock-comments.data';
import { MOCK_USERS } from './data/mock-users.data';

@Injectable({ providedIn: 'root' })
export class CommentMockService {

  /**
   * Create a new comment
   * 
   * Creates a new comment with generated ID and audit fields.
   * Includes author information in the response.
   * 
   * @param request - Comment creation details (postId, content, parentCommentId)
   * @param headers - Optional request headers (X-User-Id for author)
   * @returns Observable<ApiResponse<Comment>> with created comment including author info
   */
  createComment(
    request: CreateCommentRequest,
    headers?: { 'X-User-Id'?: string }
  ): Observable<ApiResponse<Comment | null>> {
    // Validate required fields
    if (!request.postId || !request.content) {
      return of(buildErrorResponse(
        '/api/comments',
        400,
        'Missing required fields: postId and content are required'
      ));
    }

    // Get author ID from headers or use default
    const authorId = headers?.['X-User-Id'] || 'user-1';

    // Create new comment with generated ID and audit fields
    const now = generateTimestamp();
    const newComment: Comment = {
      id: generateId(),
      postId: request.postId,
      authorId: authorId,
      content: request.content,
      parentCommentId: request.parentCommentId,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    // Include author information
    const author = MOCK_USERS.find(u => u.id === authorId);
    if (author) {
      newComment.author = author;
    }

    return of(buildApiResponse(
      newComment,
      '/api/comments',
      201,
      'Comment created successfully'
    ));
  }

  /**
   * Get a single comment by ID
   * 
   * Retrieves a comment with author information.
   * Returns 404 if comment not found.
   * 
   * @param id - Comment ID
   * @returns Observable<ApiResponse<Comment>> with comment data including author
   */
  getComment(id: string): Observable<ApiResponse<Comment | null>> {
    // Find comment by ID
    const comment = MOCK_COMMENTS.find(c => c.id === id && c.isActive);

    if (!comment) {
      return of(buildErrorResponse(
        `/api/comments/${id}`,
        404,
        `Comment with id ${id} not found`
      ));
    }

    // Include author information
    const commentWithAuthor = { ...comment };
    const author = MOCK_USERS.find(u => u.id === comment.authorId);
    if (author) {
      commentWithAuthor.author = author;
    }

    return of(buildApiResponse(
      commentWithAuthor,
      `/api/comments/${id}`,
      200,
      'Comment retrieved successfully'
    ));
  }

  /**
   * List comments with filtering support
   * 
   * Returns list of comments with author information.
   * Supports filtering by postId and sorting.
   * 
   * @param params - Query parameters for filtering and sorting
   * @returns Observable<ApiResponse<Comment[]>> with comments including authors
   */
  listComments(params?: QueryParams): Observable<ApiResponse<Comment[]>> {
    // Start with active comments
    let comments = MOCK_COMMENTS.filter(c => c.isActive);

    // Apply filtering if provided
    if (params?.filter) {
      if (params.filter['postId']) {
        comments = comments.filter(c => c.postId === params.filter!['postId']);
      }
      if (params.filter['authorId']) {
        comments = comments.filter(c => c.authorId === params.filter!['authorId']);
      }
      if (params.filter['parentCommentId']) {
        comments = comments.filter(c => c.parentCommentId === params.filter!['parentCommentId']);
      }
    }

    // Apply sorting if provided
    if (params?.sortBy) {
      const sortField = params.sortBy as keyof Comment;
      const sortOrder = params.sortOrder || 'asc';
      
      comments.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        // Handle undefined values
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Include author information for all comments
    const commentsWithAuthors = comments.map(comment => {
      const commentWithAuthor = { ...comment };
      const author = MOCK_USERS.find(u => u.id === comment.authorId);
      if (author) {
        commentWithAuthor.author = author;
      }
      return commentWithAuthor;
    });

    // Build query string for path
    const queryString = params?.filter?.['postId'] 
      ? `?postId=${params.filter['postId']}` 
      : '';

    return of(buildApiResponse(
      commentsWithAuthors,
      `/api/comments${queryString}`,
      200,
      'Comments retrieved successfully'
    ));
  }

  /**
   * Update an existing comment
   * 
   * Updates comment content and refreshes updatedAt timestamp.
   * Returns 404 if comment not found.
   * 
   * @param id - Comment ID
   * @param request - Update details (content)
   * @returns Observable<ApiResponse<Comment>> with updated comment including author
   */
  updateComment(
    id: string,
    request: UpdateCommentRequest
  ): Observable<ApiResponse<Comment | null>> {
    // Find comment by ID
    const comment = MOCK_COMMENTS.find(c => c.id === id && c.isActive);

    if (!comment) {
      return of(buildErrorResponse(
        `/api/comments/${id}`,
        404,
        `Comment with id ${id} not found`
      ));
    }

    // Create updated comment with new timestamp
    const updatedComment: Comment = {
      ...comment,
      content: request.content !== undefined ? request.content : comment.content,
      updatedAt: generateTimestamp()
    };

    // Include author information
    const author = MOCK_USERS.find(u => u.id === updatedComment.authorId);
    if (author) {
      updatedComment.author = author;
    }

    return of(buildApiResponse(
      updatedComment,
      `/api/comments/${id}`,
      200,
      'Comment updated successfully'
    ));
  }

  /**
   * Delete a comment
   * 
   * Marks a comment as inactive (soft delete).
   * Returns success confirmation.
   * 
   * @param id - Comment ID
   * @returns Observable<ApiResponse<void>> with success confirmation
   */
  deleteComment(id: string): Observable<ApiResponse<void | null>> {
    // Find comment by ID
    const comment = MOCK_COMMENTS.find(c => c.id === id && c.isActive);

    if (!comment) {
      return of(buildErrorResponse(
        `/api/comments/${id}`,
        404,
        `Comment with id ${id} not found`
      ));
    }

    // In a real implementation, this would mark the comment as inactive
    // For mock service, we just return success
    return of(buildApiResponse(
      undefined as void,
      `/api/comments/${id}`,
      200,
      'Comment deleted successfully'
    ));
  }
}
