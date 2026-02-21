/**
 * Pagination models for paginated API requests and responses
 */

/**
 * Request parameters for paginated data
 */
export interface PageRequest {
  /** Current page number (0-indexed) */
  page: number;
  /** Number of elements per page */
  size: number;
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Global search term */
  search?: string;
}

/**
 * Paginated response from the backend
 */
export interface PageResponse<T> {
  /** Data for the current page */
  content: T[];
  /** Current page number */
  page: number;
  /** Page size */
  size: number;
  /** Total number of elements across all pages */
  totalElements: number;
  /** Total number of pages */
  totalPages: number;
  /** Sort field */
  sortBy: string;
  /** Sort direction */
  sortDirection: string;
  /** Whether this is the first page */
  first: boolean;
  /** Whether this is the last page */
  last: boolean;
}
