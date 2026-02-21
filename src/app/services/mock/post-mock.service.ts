/**
 * Post Mock Service
 * 
 * Provides mock implementations for POST module endpoints including
 * CRUD operations for posts with pagination, filtering, and author information.
 * 
 * All methods return Observable<ApiResponse<T>> to match real HTTP service patterns.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse, QueryParams } from './types/api-response.interface';
import { Post } from './types/entities.interface';
import { CreatePostRequest, UpdatePostRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_POSTS } from './data/mock-posts.data';
import { MOCK_USERS } from './data/mock-users.data';

@Injectable({ providedIn: 'root' })
export class PostMockService {

  /**
   * Create a new post
   * 
   * Creates a new post with generated ID and audit fields.
   * Includes author information in the response.
   * 
   * @param request - Post creation details (title, content, organizationId)
   * @param headers - Optional request headers (X-User-Id for author)
   * @returns Observable<ApiResponse<Post>> with created post including author info
   */
  createPost(
    request: CreatePostRequest,
    headers?: { 'X-User-Id'?: string }
  ): Observable<ApiResponse<Post | null>> {
    // Validate required fields
    if (!request.title || !request.content || !request.organizationId) {
      return of(buildErrorResponse(
        '/api/posts',
        400,
        'Missing required fields: title, content, and organizationId are required'
      ));
    }

    // Get author ID from headers or use default
    const authorId = headers?.['X-User-Id'] || 'user-1';

    // Create new post with generated ID and audit fields
    const now = generateTimestamp();
    const newPost: Post = {
      id: generateId(),
      title: request.title,
      content: request.content,
      authorId: authorId,
      organizationId: request.organizationId,
      commentCount: 0,
      likeCount: 0,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    // Include author information
    const author = MOCK_USERS.find(u => u.id === authorId);
    if (author) {
      newPost.author = author;
    }

    return of(buildApiResponse(
      newPost,
      '/api/posts',
      201,
      'Post created successfully'
    ));
  }

  /**
   * Get a single post by ID
   * 
   * Retrieves a post with author information.
   * Returns 404 if post not found.
   * 
   * @param id - Post ID
   * @returns Observable<ApiResponse<Post>> with post data including author
   */
  getPost(id: string): Observable<ApiResponse<Post | null>> {
    // Find post by ID
    const post = MOCK_POSTS.find(p => p.id === id && p.isActive);

    if (!post) {
      return of(buildErrorResponse(
        `/api/posts/${id}`,
        404,
        `Post with id ${id} not found`
      ));
    }

    // Include author information
    const postWithAuthor = { ...post };
    const author = MOCK_USERS.find(u => u.id === post.authorId);
    if (author) {
      postWithAuthor.author = author;
    }

    return of(buildApiResponse(
      postWithAuthor,
      `/api/posts/${id}`,
      200,
      'Post retrieved successfully'
    ));
  }

  /**
   * List posts with pagination support
   * 
   * Returns paginated list of posts with author information.
   * Supports filtering by organizationId and sorting.
   * 
   * @param params - Query parameters for pagination, filtering, and sorting
   * @returns Observable<ApiResponse<Post[]>> with paginated posts including authors
   */
  listPosts(params?: QueryParams): Observable<ApiResponse<Post[]>> {
    // Start with active posts
    let posts = MOCK_POSTS.filter(p => p.isActive);

    // Apply filtering if provided
    if (params?.filter) {
      if (params.filter['organizationId']) {
        posts = posts.filter(p => p.organizationId === params.filter!['organizationId']);
      }
      if (params.filter['authorId']) {
        posts = posts.filter(p => p.authorId === params.filter!['authorId']);
      }
    }

    // Apply sorting if provided
    if (params?.sortBy) {
      const sortField = params.sortBy as keyof Post;
      const sortOrder = params.sortOrder || 'asc';
      
      posts.sort((a, b) => {
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

    // Include author information for all posts
    const postsWithAuthors = posts.map(post => {
      const postWithAuthor = { ...post };
      const author = MOCK_USERS.find(u => u.id === post.authorId);
      if (author) {
        postWithAuthor.author = author;
      }
      return postWithAuthor;
    });

    // Apply pagination if provided
    if (params?.page && params?.pageSize) {
      const page = params.page;
      const pageSize = params.pageSize;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      const paginatedPosts = postsWithAuthors.slice(startIndex, endIndex);
      
      return of(buildApiResponse(
        paginatedPosts,
        `/api/posts?page=${page}&pageSize=${pageSize}`,
        200,
        'Posts retrieved successfully'
      ));
    }

    // Return all posts if no pagination
    return of(buildApiResponse(
      postsWithAuthors,
      '/api/posts',
      200,
      'Posts retrieved successfully'
    ));
  }

  /**
   * Update an existing post
   * 
   * Updates post fields and refreshes updatedAt timestamp.
   * Returns 404 if post not found.
   * 
   * @param id - Post ID
   * @param request - Update details (title, content)
   * @returns Observable<ApiResponse<Post>> with updated post including author
   */
  updatePost(
    id: string,
    request: UpdatePostRequest
  ): Observable<ApiResponse<Post | null>> {
    // Find post by ID
    const post = MOCK_POSTS.find(p => p.id === id && p.isActive);

    if (!post) {
      return of(buildErrorResponse(
        `/api/posts/${id}`,
        404,
        `Post with id ${id} not found`
      ));
    }

    // Create updated post with new timestamp
    const updatedPost: Post = {
      ...post,
      title: request.title !== undefined ? request.title : post.title,
      content: request.content !== undefined ? request.content : post.content,
      updatedAt: generateTimestamp()
    };

    // Include author information
    const author = MOCK_USERS.find(u => u.id === updatedPost.authorId);
    if (author) {
      updatedPost.author = author;
    }

    return of(buildApiResponse(
      updatedPost,
      `/api/posts/${id}`,
      200,
      'Post updated successfully'
    ));
  }

  /**
   * Delete a post
   * 
   * Marks a post as inactive (soft delete).
   * Returns success confirmation.
   * 
   * @param id - Post ID
   * @returns Observable<ApiResponse<void>> with success confirmation
   */
  deletePost(id: string): Observable<ApiResponse<void | null>> {
    // Find post by ID
    const post = MOCK_POSTS.find(p => p.id === id && p.isActive);

    if (!post) {
      return of(buildErrorResponse(
        `/api/posts/${id}`,
        404,
        `Post with id ${id} not found`
      ));
    }

    // In a real implementation, this would mark the post as inactive
    // For mock service, we just return success
    return of(buildApiResponse(
      undefined as void,
      `/api/posts/${id}`,
      200,
      'Post deleted successfully'
    ));
  }
}
