/**
 * Generic API response wrapper
 * Provides a consistent response format for all API operations
 */

/**
 * API error details
 */
export interface ApiError {
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Timestamp of when the error occurred */
  timestamp: Date;
}

/**
 * Result type for success/failure pattern
 */
export type Result<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: ApiError };

/**
 * Factory function to create a success result
 * @param data - The data payload
 * @param message - Optional success message from backend
 */
export function success<T>(data: T, message?: string): Result<T> {
  return { success: true, data, message };
}

/**
 * Factory function to create a failure result
 * @param error - The API error details
 */
export function failure<T>(error: ApiError): Result<T> {
  return { success: false, error };
}
