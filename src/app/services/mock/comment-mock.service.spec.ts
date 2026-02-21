/**
 * Unit Tests for Comment Mock Service
 */

import { TestBed } from '@angular/core/testing';
import { CommentMockService } from './comment-mock.service';
import { CreateCommentRequest, UpdateCommentRequest } from './types/requests.interface';

describe('CommentMockService', () => {
  let service: CommentMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentMockService]
    });
    service = TestBed.inject(CommentMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createComment', () => {
    it('should create a comment with generated ID and audit fields', (done) => {
      const request: CreateCommentRequest = {
        postId: 'post-1',
        content: 'This is a test comment'
      };

      service.createComment(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(201);
        expect(response.message).toBe('Comment created successfully');
        expect(response.data).toBeDefined();
        expect(response.data!.id).toBeTruthy();
        expect(response.data!.postId).toBe(request.postId);
        expect(response.data!.content).toBe(request.content);
        expect(response.data!.createdAt).toBeTruthy();
        expect(response.data!.updatedAt).toBeTruthy();
        expect(response.data!.isActive).toBe(true);
        done();
      });
    });

    it('should include author information in created comment', (done) => {
      const request: CreateCommentRequest = {
        postId: 'post-1',
        content: 'Test comment'
      };

      service.createComment(request, { 'X-User-Id': 'user-1' }).subscribe(response => {
        expect(response.data!.authorId).toBe('user-1');
        expect(response.data!.author).toBeDefined();
        expect(response.data!.author!.id).toBe('user-1');
        done();
      });
    });

    it('should support parent comment ID for nested comments', (done) => {
      const request: CreateCommentRequest = {
        postId: 'post-1',
        content: 'Reply to comment',
        parentCommentId: 'comment-1'
      };

      service.createComment(request).subscribe(response => {
        expect(response.data!.parentCommentId).toBe('comment-1');
        done();
      });
    });

    it('should return 400 when postId is missing', (done) => {
      const request: CreateCommentRequest = {
        postId: '',
        content: 'Test comment'
      };

      service.createComment(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('required');
        done();
      });
    });

    it('should return 400 when content is missing', (done) => {
      const request: CreateCommentRequest = {
        postId: 'post-1',
        content: ''
      };

      service.createComment(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('required');
        done();
      });
    });

    it('should use default user when no X-User-Id header provided', (done) => {
      const request: CreateCommentRequest = {
        postId: 'post-1',
        content: 'Test comment'
      };

      service.createComment(request).subscribe(response => {
        expect(response.data!.authorId).toBe('user-1');
        done();
      });
    });
  });

  describe('getComment', () => {
    it('should retrieve a comment by ID with author information', (done) => {
      service.getComment('comment-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data!.id).toBe('comment-1');
        expect(response.data!.author).toBeDefined();
        done();
      });
    });

    it('should return 404 when comment not found', (done) => {
      service.getComment('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        expect(response.message).toContain('not found');
        done();
      });
    });

    it('should include all comment fields', (done) => {
      service.getComment('comment-1').subscribe(response => {
        const comment = response.data!;
        expect(comment.postId).toBeDefined();
        expect(comment.authorId).toBeDefined();
        expect(comment.content).toBeDefined();
        expect(comment.createdAt).toBeDefined();
        expect(comment.updatedAt).toBeDefined();
        expect(comment.isActive).toBeDefined();
        done();
      });
    });
  });

  describe('listComments', () => {
    it('should return array of comments', (done) => {
      service.listComments().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should include author information for all comments', (done) => {
      service.listComments().subscribe(response => {
        response.data.forEach(comment => {
          expect(comment.author).toBeDefined();
          expect(comment.author!.id).toBe(comment.authorId);
        });
        done();
      });
    });

    it('should filter comments by postId', (done) => {
      service.listComments({ filter: { postId: 'post-1' } }).subscribe(response => {
        expect(response.data.length).toBeGreaterThan(0);
        response.data.forEach(comment => {
          expect(comment.postId).toBe('post-1');
        });
        done();
      });
    });

    it('should filter comments by authorId', (done) => {
      service.listComments({ filter: { authorId: 'user-1' } }).subscribe(response => {
        response.data.forEach(comment => {
          expect(comment.authorId).toBe('user-1');
        });
        done();
      });
    });

    it('should filter comments by parentCommentId', (done) => {
      service.listComments({ filter: { parentCommentId: 'comment-1' } }).subscribe(response => {
        response.data.forEach(comment => {
          expect(comment.parentCommentId).toBe('comment-1');
        });
        done();
      });
    });

    it('should sort comments by createdAt ascending', (done) => {
      service.listComments({ 
        sortBy: 'createdAt', 
        sortOrder: 'asc' 
      }).subscribe(response => {
        for (let i = 1; i < response.data.length; i++) {
          const prev = new Date(response.data[i - 1].createdAt).getTime();
          const curr = new Date(response.data[i].createdAt).getTime();
          expect(prev).toBeLessThanOrEqual(curr);
        }
        done();
      });
    });

    it('should sort comments by createdAt descending', (done) => {
      service.listComments({ 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      }).subscribe(response => {
        for (let i = 1; i < response.data.length; i++) {
          const prev = new Date(response.data[i - 1].createdAt).getTime();
          const curr = new Date(response.data[i].createdAt).getTime();
          expect(prev).toBeGreaterThanOrEqual(curr);
        }
        done();
      });
    });

    it('should return empty array when no comments match filter', (done) => {
      service.listComments({ filter: { postId: 'non-existent-post' } }).subscribe(response => {
        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBe(0);
        done();
      });
    });
  });

  describe('updateComment', () => {
    it('should update comment content', (done) => {
      const request: UpdateCommentRequest = {
        content: 'Updated comment content'
      };

      service.updateComment('comment-1', request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data!.content).toBe('Updated comment content');
        done();
      });
    });

    it('should update updatedAt timestamp', (done) => {
      const request: UpdateCommentRequest = {
        content: 'Updated content'
      };

      service.updateComment('comment-1', request).subscribe(response => {
        const originalComment = response.data!;
        const updatedAt = new Date(originalComment.updatedAt).getTime();
        const createdAt = new Date(originalComment.createdAt).getTime();
        expect(updatedAt).toBeGreaterThanOrEqual(createdAt);
        done();
      });
    });

    it('should include author information in updated comment', (done) => {
      const request: UpdateCommentRequest = {
        content: 'Updated content'
      };

      service.updateComment('comment-1', request).subscribe(response => {
        expect(response.data!.author).toBeDefined();
        expect(response.data!.author!.id).toBe(response.data!.authorId);
        done();
      });
    });

    it('should return 404 when comment not found', (done) => {
      const request: UpdateCommentRequest = {
        content: 'Updated content'
      };

      service.updateComment('non-existent-id', request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        expect(response.message).toContain('not found');
        done();
      });
    });

    it('should preserve other fields when updating', (done) => {
      const request: UpdateCommentRequest = {
        content: 'New content'
      };

      service.updateComment('comment-1', request).subscribe(response => {
        expect(response.data!.id).toBe('comment-1');
        expect(response.data!.postId).toBeDefined();
        expect(response.data!.authorId).toBeDefined();
        expect(response.data!.content).toBe('New content');
        expect(response.data!.isActive).toBe(true);
        done();
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment successfully', (done) => {
      service.deleteComment('comment-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toBe('Comment deleted successfully');
        done();
      });
    });

    it('should return 404 when comment not found', (done) => {
      service.deleteComment('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        expect(response.message).toContain('not found');
        done();
      });
    });

    it('should return void data on successful deletion', (done) => {
      service.deleteComment('comment-1').subscribe(response => {
        expect(response.data).toBeUndefined();
        done();
      });
    });
  });

  describe('ApiResponse structure', () => {
    it('should return complete ApiResponse structure for create', (done) => {
      const request: CreateCommentRequest = {
        postId: 'post-1',
        content: 'Test'
      };

      service.createComment(request).subscribe(response => {
        expect(response.success).toBeDefined();
        expect(response.status).toBeDefined();
        expect(response.message).toBeDefined();
        expect(response.data).toBeDefined();
        expect(response.timestamp).toBeDefined();
        expect(response.path).toBeDefined();
        done();
      });
    });

    it('should have valid ISO 8601 timestamp', (done) => {
      service.listComments().subscribe(response => {
        expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        done();
      });
    });
  });
});
