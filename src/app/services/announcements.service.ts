import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Announcement,
  BroadcastMessage,
  Poll,
  Discussion
} from '../models/announcement.model';

/**
 * Service for managing announcements (broadcasts and polls)
 * Handles HTTP communication with the backend API
 * 
 * **Validates: Requirements 2.1, 4.1, 5.1**
 */
@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private readonly apiUrl = '/api/announcements';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all announcements (broadcasts and polls) from the backend
   * The returned list is sorted by priority and timestamp
   * 
   * @returns Observable<Announcement[]> - Array of announcements
   * @throws Error if the HTTP request fails
   * 
   * **Validates: Requirements 2.1, 4.1, 6.1, 6.2, 6.3**
   */
  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl).pipe(
      map(announcements => this.deserializeDates(announcements)),
      map(announcements => this.sortAnnouncements(announcements)),
      catchError(this.handleError)
    );
  }

  /**
   * Sorts announcements by priority and timestamp
   * Priority is determined by:
   * 1. Urgent broadcasts get highest priority (+100)
   * 2. Polls ending within 24 hours get high priority (+50)
   * 3. Base priority from announcement.priority field
   * 
   * Within the same priority level, announcements are sorted by createdAt descending (newest first)
   * 
   * @param announcements - Array of announcements to sort
   * @returns Sorted array of announcements
   * 
   * **Validates: Requirements 6.1, 6.2, 6.3**
   */
  sortAnnouncements(announcements: Announcement[]): Announcement[] {
    return [...announcements].sort((a, b) => {
      // Calculate priority for each announcement
      const priorityA = this.calculatePriority(a);
      const priorityB = this.calculatePriority(b);
      
      // Sort by priority descending (higher priority first)
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      // If same priority, sort by timestamp descending (newer first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  /**
   * Calculates the priority score for an announcement
   * 
   * Priority calculation:
   * - Base priority from announcement.priority field (default 0)
   * - +100 for urgent broadcast messages
   * - +50 for polls ending within 24 hours (and not yet ended)
   * 
   * @param announcement - The announcement to calculate priority for
   * @returns Priority score (higher = more important)
   * 
   * **Validates: Requirements 6.1, 6.3**
   */
  private calculatePriority(announcement: Announcement): number {
    let priority = announcement.priority || 0;
    
    // Increase priority for urgent broadcast messages
    if (announcement.type === 'broadcast' && announcement.isUrgent) {
      priority += 100;
    }
    
    // Increase priority for polls close to expiring (< 24 hours remaining)
    if (announcement.type === 'poll') {
      const hoursRemaining = (announcement.endsAt.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursRemaining < 24 && hoursRemaining > 0) {
        priority += 50;
      }
    }
    
    return priority;
  }

  /**
   * Retrieves a specific broadcast message by ID
   * 
   * @param id - The unique identifier of the broadcast message
   * @returns Observable<BroadcastMessage> - The broadcast message details
   * @throws Error if the HTTP request fails or broadcast not found
   * 
   * **Validates: Requirement 2.1**
   */
  getBroadcastById(id: string): Observable<BroadcastMessage> {
    return this.http.get<BroadcastMessage>(`${this.apiUrl}/broadcasts/${id}`).pipe(
      map(broadcast => this.deserializeBroadcastDates(broadcast)),
      catchError(this.handleError)
    );
  }

  /**
   * Registers a user's vote on a poll option
   * Returns the updated poll with new vote counts and percentages
   * 
   * @param pollId - The unique identifier of the poll
   * @param optionId - The unique identifier of the selected option
   * @returns Observable<Poll> - The updated poll with new vote data
   * @throws Error if the HTTP request fails or vote is invalid
   * 
   * **Validates: Requirement 5.1**
   */
  votePoll(pollId: string, optionId: string): Observable<Poll> {
    return this.http.post<Poll>(
      `${this.apiUrl}/polls/${pollId}/vote`,
      { optionId }
    ).pipe(
      map(poll => this.deserializePollDates(poll)),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves the discussion thread associated with a poll
   * 
   * @param pollId - The unique identifier of the poll
   * @returns Observable<Discussion> - The discussion thread with all messages
   * @throws Error if the HTTP request fails or discussion not found
   * 
   * **Validates: Requirement 4.1**
   */
  getPollDiscussion(pollId: string): Observable<Discussion> {
    return this.http.get<Discussion>(`${this.apiUrl}/polls/${pollId}/discussion`).pipe(
      map(discussion => this.deserializeDiscussionDates(discussion)),
      catchError(this.handleError)
    );
  }

  /**
   * Deserializes date strings to Date objects for an array of announcements
   * Handles both broadcast and poll types
   * 
   * @param announcements - Array of announcements with date strings
   * @returns Array of announcements with Date objects
   */
  private deserializeDates(announcements: Announcement[]): Announcement[] {
    return announcements.map(announcement => {
      if (announcement.type === 'broadcast') {
        return this.deserializeBroadcastDates(announcement);
      } else {
        return this.deserializePollDates(announcement);
      }
    });
  }

  /**
   * Deserializes date strings to Date objects for a broadcast message
   * 
   * @param broadcast - Broadcast message with date strings
   * @returns Broadcast message with Date objects
   */
  private deserializeBroadcastDates(broadcast: BroadcastMessage): BroadcastMessage {
    return {
      ...broadcast,
      createdAt: new Date(broadcast.createdAt)
    };
  }

  /**
   * Deserializes date strings to Date objects for a poll
   * 
   * @param poll - Poll with date strings
   * @returns Poll with Date objects
   */
  private deserializePollDates(poll: Poll): Poll {
    return {
      ...poll,
      createdAt: new Date(poll.createdAt),
      endsAt: new Date(poll.endsAt)
    };
  }

  /**
   * Deserializes date strings to Date objects for a discussion
   * 
   * @param discussion - Discussion with date strings
   * @returns Discussion with Date objects
   */
  private deserializeDiscussionDates(discussion: Discussion): Discussion {
    return {
      ...discussion,
      messages: discussion.messages.map(message => ({
        ...message,
        createdAt: new Date(message.createdAt)
      }))
    };
  }

  /**
   * Handles HTTP errors and returns a user-friendly error message
   * 
   * @param error - The HTTP error response
   * @returns Observable that throws an error with a descriptive message
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 409:
          errorMessage = 'Conflict. You may have already voted on this poll.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('AnnouncementsService error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
