/**
 * ManageCommunicationsUseCase
 * Handles admin actions on posts, polls, and comments (lifecycle management).
 */
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
import {
  PostResponse,
  PollResponse,
  CommentResponse,
  CommentRequest,
  PostRequest,
  PollRequest
} from '@domain/models/announcement/announcement.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class ManageCommunicationsUseCase {
  private readonly announcementGateway = inject(AnnouncementGateway);

  // ========================
  // POST ACTIONS
  // ========================

  createPost(request: PostRequest): Observable<Result<PostResponse>> {
    return this.announcementGateway.createPost(request).pipe(
      catchError(() => of(failure<PostResponse>({
        code: 'CREATE_POST_ERROR', message: 'Error al crear publicación', timestamp: new Date()
      })))
    );
  }

  publishPost(id: number): Observable<Result<PostResponse>> {
    return this.announcementGateway.publishPost(id).pipe(
      catchError(() => of(failure<PostResponse>({
        code: 'PUBLISH_ERROR', message: 'Error al publicar', timestamp: new Date()
      })))
    );
  }

  archivePost(id: number): Observable<Result<PostResponse>> {
    return this.announcementGateway.archivePost(id).pipe(
      catchError(() => of(failure<PostResponse>({
        code: 'ARCHIVE_ERROR', message: 'Error al archivar', timestamp: new Date()
      })))
    );
  }

  reactivatePost(id: number): Observable<Result<PostResponse>> {
    return this.announcementGateway.reactivatePost(id).pipe(
      catchError(() => of(failure<PostResponse>({
        code: 'REACTIVATE_ERROR', message: 'Error al reactivar', timestamp: new Date()
      })))
    );
  }

  togglePinPost(id: number): Observable<Result<PostResponse>> {
    return this.announcementGateway.togglePinPost(id).pipe(
      catchError(() => of(failure<PostResponse>({
        code: 'PIN_ERROR', message: 'Error al fijar/desfijar', timestamp: new Date()
      })))
    );
  }

  deletePost(id: number): Observable<Result<void>> {
    return this.announcementGateway.deletePost(id).pipe(
      catchError(() => of(failure<void>({
        code: 'DELETE_ERROR', message: 'Error al eliminar publicación', timestamp: new Date()
      })))
    );
  }

  // ========================
  // POLL ACTIONS
  // ========================

  createPoll(request: PollRequest): Observable<Result<PollResponse>> {
    return this.announcementGateway.createPoll(request).pipe(
      catchError(() => of(failure<PollResponse>({
        code: 'CREATE_POLL_ERROR', message: 'Error al crear encuesta', timestamp: new Date()
      })))
    );
  }

  activatePoll(id: number): Observable<Result<PollResponse>> {
    return this.announcementGateway.activatePoll(id).pipe(
      catchError(() => of(failure<PollResponse>({
        code: 'ACTIVATE_ERROR', message: 'Error al activar encuesta', timestamp: new Date()
      })))
    );
  }

  closePoll(id: number): Observable<Result<PollResponse>> {
    return this.announcementGateway.closePoll(id).pipe(
      catchError(() => of(failure<PollResponse>({
        code: 'CLOSE_ERROR', message: 'Error al cerrar encuesta', timestamp: new Date()
      })))
    );
  }

  // ========================
  // COMMENT ACTIONS
  // ========================

  deleteComment(id: number): Observable<Result<void>> {
    return this.announcementGateway.deleteComment(id).pipe(
      catchError(() => of(failure<void>({
        code: 'DELETE_COMMENT_ERROR', message: 'Error al eliminar comentario', timestamp: new Date()
      })))
    );
  }

  hideComment(id: number): Observable<Result<CommentResponse>> {
    return this.announcementGateway.hideComment(id).pipe(
      catchError(() => of(failure<CommentResponse>({
        code: 'HIDE_ERROR', message: 'Error al ocultar comentario', timestamp: new Date()
      })))
    );
  }

  approveComment(id: number): Observable<Result<CommentResponse>> {
    return this.announcementGateway.approveComment(id).pipe(
      catchError(() => of(failure<CommentResponse>({
        code: 'APPROVE_ERROR', message: 'Error al aprobar comentario', timestamp: new Date()
      })))
    );
  }

  replyAsAdmin(request: CommentRequest): Observable<Result<CommentResponse>> {
    return this.announcementGateway.createComment(request).pipe(
      catchError(() => of(failure<CommentResponse>({
        code: 'REPLY_ERROR', message: 'Error al responder como admin', timestamp: new Date()
      })))
    );
  }

  getFlaggedComments(organizationId: number): Observable<Result<CommentResponse[]>> {
    return this.announcementGateway.getFlaggedComments(organizationId).pipe(
      catchError(() => of(failure<CommentResponse[]>({
        code: 'FLAGGED_ERROR', message: 'Error al obtener comentarios flaggeados', timestamp: new Date()
      })))
    );
  }

  getAllCommentsByPost(postId: number): Observable<Result<CommentResponse[]>> {
    return this.announcementGateway.getAllCommentsByPost(postId).pipe(
      catchError(() => of(failure<CommentResponse[]>({
        code: 'COMMENTS_ERROR', message: 'Error al obtener comentarios', timestamp: new Date()
      })))
    );
  }
}
