/**
 * AdminCommentPanelComponent - Panel for admin comment management.
 * Supports viewing all comments (including hidden), hiding, approving, deleting,
 * and replying as admin. Shows flagged comments with their flag reasons.
 */
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommentResponse } from '@domain/models/announcement/announcement.model';

@Component({
  selector: 'app-admin-comment-panel',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-comment-panel.component.html',
  styleUrl: './admin-comment-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCommentPanelComponent {
  readonly comments = input<CommentResponse[]>([]);
  readonly postId = input<number>(0);
  readonly loading = input<boolean>(false);

  readonly deleteAction = output<number>();
  readonly hideAction = output<number>();
  readonly approveAction = output<number>();
  readonly replyAction = output<{ postId: number; content: string }>();
  readonly closePanel = output<void>();

  replyContent = '';

  onDelete(commentId: number): void {
    this.deleteAction.emit(commentId);
  }

  onHide(commentId: number): void {
    this.hideAction.emit(commentId);
  }

  onApprove(commentId: number): void {
    this.approveAction.emit(commentId);
  }

  onReply(): void {
    if (this.replyContent.trim()) {
      this.replyAction.emit({ postId: this.postId(), content: this.replyContent.trim() });
      this.replyContent = '';
    }
  }

  onClose(): void {
    this.closePanel.emit();
  }

  isAdmin(comment: CommentResponse): boolean {
    return comment.authorRole === 'ADMIN_ATLAS' || comment.authorRole === 'ADMIN';
  }

  isFlagged(comment: CommentResponse): boolean {
    return !comment.isApproved && !!comment.flagReason;
  }

  isHidden(comment: CommentResponse): boolean {
    return !comment.isApproved && !comment.flagReason;
  }
}
