/**
 * Response Builder Utility
 * 
 * Provides helper functions to construct standardized ApiResponse objects
 * for mock services. Ensures all responses follow the same structure with
 * required fields populated correctly.
 */

import { ApiResponse } from '../types/api-response.interface';

/**
 * Builds a successful ApiResponse with all required fields.
 * 
 * @template T - The type of data being returned
 * @param data - The response payload
 * @param path - The API endpoint path (e.g., '/api/posts')
 * @param status - HTTP status code (defaults to 200)
 * @param message - Human-readable success message (defaults to 'Success')
 * @returns Complete ApiResponse object with success=true
 * 
 * @example
 * const response = buildApiResponse(post, '/api/posts', 201, 'Post created successfully');
 */
export function buildApiResponse<T>(
  data: T,
  path: string,
  status: number = 200,
  message: string = 'Success'
): ApiResponse<T> {
  return {
    success: true,
    status,
    message,
    data,
    timestamp: new Date().toISOString(),
    path
  };
}

/**
 * Builds an error ApiResponse for failure scenarios.
 * 
 * @param path - The API endpoint path (e.g., '/api/posts/123')
 * @param status - HTTP error status code (400, 404, 500, etc.)
 * @param message - Human-readable error message
 * @returns Complete ApiResponse object with success=false and data=null
 * 
 * @example
 * const response = buildErrorResponse('/api/posts/999', 404, 'Post not found');
 */
export function buildErrorResponse(
  path: string,
  status: number,
  message: string
): ApiResponse<null> {
  return {
    success: false,
    status,
    message,
    data: null,
    timestamp: new Date().toISOString(),
    path
  };
}
