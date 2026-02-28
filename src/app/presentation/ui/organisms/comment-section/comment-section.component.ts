import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '@domain/models/announcement/announcement.model';

/**
 * Comment section organism — displays thread of comments with reply capability.
 * Supports content moderation feedback.
 */
@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentSectionComponent {
  readonly comments = input.required<Comment[]>();
  readonly postId = input.required<number>();
  readonly allowComments = input<boolean>(true);
  readonly isLoading = input<boolean>(false);
  readonly moderationError = input<string | null>(null);

  readonly commentSubmit = output<{ postId: number; content: string; parentId?: number }>();
  readonly commentDelete = output<number>();

  protected newComment = signal('');
  protected replyingTo = signal<number | null>(null);
  protected replyContent = signal('');

  onSubmitComment(): void {
    const content = this.newComment().trim();
    if (!content) return;
    
    this.commentSubmit.emit({ postId: this.postId(), content });
    this.newComment.set('');
  }

  onReply(commentId: number): void {
    this.replyingTo.set(commentId);
    this.replyContent.set('');
  }

  onCancelReply(): void {
    this.replyingTo.set(null);
    this.replyContent.set('');
  }

  onSubmitReply(parentId: number): void {
    const content = this.replyContent().trim();
    if (!content) return;
    
    this.commentSubmit.emit({ postId: this.postId(), content, parentId });
    this.replyingTo.set(null);
    this.replyContent.set('');
  }

  onDelete(commentId: number): void {
    this.commentDelete.emit(commentId);
  }
}
