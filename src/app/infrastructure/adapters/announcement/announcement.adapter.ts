/**
 * Announcement Adapter - Implements AnnouncementGateway for real HTTP operations.
 * Connects to backend POST, POLL, and COMMENT endpoints.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout, retry } from 'rxjs/operators';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
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
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { PageResponse } from '@domain/models/common/pagination.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AnnouncementAdapter extends AnnouncementGateway {
  private readonly http = inject(HttpClient);

  private readonly POSTS_ENDPOINT = `${environment.apiUrl}/posts`;
  private readonly POLLS_ENDPOINT = `${environment.apiUrl}/polls`;
  private readonly COMMENTS_ENDPOINT = `${environment.apiUrl}/comments`;
  private readonly TIMEOUT_MS = 10000;
  private readonly RETRY_ATTEMPTS = 1;

  // ========================
  // POSTS
  // ========================

  override getPosts(organizationId: number): Observable<Result<PostResponse[]>> {
    return this.http.get<{ data: PostResponse[]; message: string }>(
      `${this.POSTS_ENDPOINT}/organization/${organizationId}/published`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PostResponse[]>(error)))
    );
  }

  override getAllPosts(organizationId: number): Observable<Result<PostResponse[]>> {
    return this.http.get<{ data: PostResponse[]; message: string }>(
      `${this.POSTS_ENDPOINT}/organization/${organizationId}`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PostResponse[]>(error)))
    );
  }

  override getPostById(id: number): Observable<Result<PostResponse>> {
    return this.http.get<{ data: PostResponse; message: string }>(`${this.POSTS_ENDPOINT}/${id}`).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PostResponse>(error)))
    );
  }

  override createPost(request: PostRequest): Observable<Result<PostResponse>> {
    return this.http.post<{ data: PostResponse; message: string }>(this.POSTS_ENDPOINT, request).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PostResponse>(error)))
    );
  }

  override updatePost(id: number, request: PostRequest): Observable<Result<PostResponse>> {
    return this.http.put<{ data: PostResponse; message: string }>(`${this.POSTS_ENDPOINT}/${id}`, request).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PostResponse>(error)))
    );
  }

  override publishPost(id: number): Observable<Result<PostResponse>> {
    return this.http.post<{ data: PostResponse; message: string }>(`${this.POSTS_ENDPOINT}/${id}/publish`, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PostResponse>(error)))
    );
  }

  override archivePost(id: number): Observable<Result<PostResponse>> {
    return this.http.post<{ data: PostResponse; message: string }>(`${this.POSTS_ENDPOINT}/${id}/archive`, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PostResponse>(error)))
    );
  }

  override togglePinPost(id: number): Observable<Result<PostResponse>> {
    return this.http.post<{ data: PostResponse; message: string }>(`${this.POSTS_ENDPOINT}/${id}/toggle-pin`, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PostResponse>(error)))
    );
  }

  override deletePost(id: number): Observable<Result<void>> {
    return this.http.delete<{ data: void; message: string }>(`${this.POSTS_ENDPOINT}/${id}`).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(undefined as unknown as void, response.message)),
      catchError(error => of(this.handleError<void>(error)))
    );
  }

  // ========================
  // POLLS
  // ========================

  override getActivePolls(organizationId: number): Observable<Result<PollResponse[]>> {
    return this.http.get<{ data: PollResponse[]; message: string }>(
      `${this.POLLS_ENDPOINT}/organization/${organizationId}/active`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PollResponse[]>(error)))
    );
  }

  override getAllPolls(organizationId: number): Observable<Result<PollResponse[]>> {
    return this.http.get<{ data: PollResponse[]; message: string }>(
      `${this.POLLS_ENDPOINT}/organization/${organizationId}`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PollResponse[]>(error)))
    );
  }

  override getPollById(id: number): Observable<Result<PollResponse>> {
    return this.http.get<{ data: PollResponse; message: string }>(`${this.POLLS_ENDPOINT}/${id}`).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PollResponse>(error)))
    );
  }

  override createPoll(request: PollRequest): Observable<Result<PollResponse>> {
    return this.http.post<{ data: PollResponse; message: string }>(this.POLLS_ENDPOINT, request).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PollResponse>(error)))
    );
  }

  override votePoll(pollId: number, request: VoteRequest): Observable<Result<void>> {
    return this.http.post<{ data: void; message: string }>(`${this.POLLS_ENDPOINT}/${pollId}/vote`, request).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(undefined as unknown as void, response.message)),
      catchError(error => of(this.handleError<void>(error)))
    );
  }

  override activatePoll(id: number): Observable<Result<PollResponse>> {
    return this.http.post<{ data: PollResponse; message: string }>(`${this.POLLS_ENDPOINT}/${id}/activate`, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PollResponse>(error)))
    );
  }

  override closePoll(id: number): Observable<Result<PollResponse>> {
    return this.http.post<{ data: PollResponse; message: string }>(`${this.POLLS_ENDPOINT}/${id}/close`, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PollResponse>(error)))
    );
  }

  override getPollResults(id: number): Observable<Result<PollResponse>> {
    return this.http.get<{ data: PollResponse; message: string }>(`${this.POLLS_ENDPOINT}/${id}/results`).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PollResponse>(error)))
    );
  }

  // ========================
  // COMMENTS
  // ========================

  override getComments(postId: number): Observable<Result<CommentResponse[]>> {
    return this.http.get<{ data: CommentResponse[]; message: string }>(
      `${this.COMMENTS_ENDPOINT}/post/${postId}`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<CommentResponse[]>(error)))
    );
  }

  override createComment(request: CommentRequest): Observable<Result<CommentResponse>> {
    return this.http.post<{ data: CommentResponse; message: string }>(this.COMMENTS_ENDPOINT, request).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<CommentResponse>(error)))
    );
  }

  override deleteComment(id: number): Observable<Result<void>> {
    return this.http.delete<{ data: void; message: string }>(`${this.COMMENTS_ENDPOINT}/${id}`).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(undefined as unknown as void, response.message)),
      catchError(error => of(this.handleError<void>(error)))
    );
  }

  // ========================
  // ADMIN PANEL
  // ========================

  override searchPosts(filters: PostPollFilterParams): Observable<Result<PageResponse<PostResponse>>> {
    const params = this.buildFilterParams(filters);
    return this.http.get<{ data: PageResponse<PostResponse>; message: string }>(
      `${this.POSTS_ENDPOINT}/admin/search`, { params }
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PageResponse<PostResponse>>(error)))
    );
  }

  override searchPolls(filters: PostPollFilterParams): Observable<Result<PageResponse<PollResponse>>> {
    const params = this.buildFilterParams(filters);
    return this.http.get<{ data: PageResponse<PollResponse>; message: string }>(
      `${this.POLLS_ENDPOINT}/admin/search`, { params }
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PageResponse<PollResponse>>(error)))
    );
  }

  override getPostStats(): Observable<Result<Record<string, number>>> {
    return this.http.get<{ data: Record<string, number>; message: string }>(
      `${this.POSTS_ENDPOINT}/admin/stats`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<Record<string, number>>(error)))
    );
  }

  override getPollStats(): Observable<Result<Record<string, number>>> {
    return this.http.get<{ data: Record<string, number>; message: string }>(
      `${this.POLLS_ENDPOINT}/admin/stats`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<Record<string, number>>(error)))
    );
  }

  override reactivatePost(id: number): Observable<Result<PostResponse>> {
    return this.http.post<{ data: PostResponse; message: string }>(`${this.POSTS_ENDPOINT}/${id}/reactivate`, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<PostResponse>(error)))
    );
  }

  override hideComment(id: number): Observable<Result<CommentResponse>> {
    return this.http.post<{ data: CommentResponse; message: string }>(`${this.COMMENTS_ENDPOINT}/${id}/hide`, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<CommentResponse>(error)))
    );
  }

  override approveComment(id: number): Observable<Result<CommentResponse>> {
    return this.http.post<{ data: CommentResponse; message: string }>(`${this.COMMENTS_ENDPOINT}/${id}/approve`, {}).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<CommentResponse>(error)))
    );
  }

  override getFlaggedComments(organizationId: number): Observable<Result<CommentResponse[]>> {
    return this.http.get<{ data: CommentResponse[]; message: string }>(
      `${this.COMMENTS_ENDPOINT}/flagged/${organizationId}`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<CommentResponse[]>(error)))
    );
  }

  override getAllCommentsByPost(postId: number): Observable<Result<CommentResponse[]>> {
    return this.http.get<{ data: CommentResponse[]; message: string }>(
      `${this.COMMENTS_ENDPOINT}/post/${postId}/all`
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.RETRY_ATTEMPTS),
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<CommentResponse[]>(error)))
    );
  }

  // ========================
  // Helpers
  // ========================

  private buildFilterParams(filters: PostPollFilterParams): Record<string, string> {
    const params: Record<string, string> = {
      page: filters.page.toString(),
      size: filters.size.toString()
    };
    if (filters.type) params['type'] = filters.type;
    if (filters.status) params['status'] = filters.status;
    if (filters.dateFrom) params['dateFrom'] = filters.dateFrom;
    if (filters.dateTo) params['dateTo'] = filters.dateTo;
    if (filters.search) params['search'] = filters.search;
    return params;
  }

  // ========================
  // Error handling
  // ========================

  private handleError<T>(error: unknown): Result<T> {
    const httpError = error as { status?: number; error?: { message?: string }; name?: string };

    if (httpError.status === 0 || httpError.name === 'TimeoutError') {
      return failure({
        code: 'NETWORK_ERROR',
        message: 'Error de conexión con el servidor. Verifica tu conexión a internet.',
        timestamp: new Date()
      });
    }

    return failure({
      code: `HTTP_${httpError.status || 'UNKNOWN'}`,
      message: httpError.error?.message || 'Error inesperado',
      timestamp: new Date()
    });
  }
}
