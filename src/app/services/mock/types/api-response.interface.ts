/**
 * Standard API response wrapper for all mock service responses.
 * Wraps data with metadata including success status, HTTP status code,
 * message, timestamp, and request path.
 */
export interface ApiResponse<T> {
  /** Indicates if the operation was successful */
  success: boolean;
  
  /** HTTP status code (200, 201, 400, 404, etc.) */
  status: number;
  
  /** Human-readable message describing the result */
  message: string;
  
  /** The actual response payload */
  data: T;
  
  /** ISO 8601 formatted timestamp of when the response was generated */
  timestamp: string;
  
  /** The API endpoint path that was called */
  path: string;
}

/**
 * Standard headers used in API requests.
 * These headers provide context about the user, organization, and authorization.
 */
export interface Headers {
  /** User ID making the request */
  'X-User-Id'?: string;
  
  /** Organization ID context for the request */
  'X-Organization-Id'?: string;
  
  /** Operator ID for administrative operations */
  'X-Operator-Id'?: string;
  
  /** Bearer token for authentication */
  'Authorization'?: string;
}

/**
 * Query parameters for list operations supporting pagination and filtering.
 */
export interface QueryParams {
  /** Page number (1-indexed) */
  page?: number;
  
  /** Number of items per page */
  pageSize?: number;
  
  /** Field name to sort by */
  sortBy?: string;
  
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  
  /** Dynamic filter criteria as key-value pairs */
  filter?: Record<string, any>;
}
