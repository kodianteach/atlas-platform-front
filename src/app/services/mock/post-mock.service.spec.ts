/**
 * Unit Tests for PostMockService
 * 
 * Tests CRUD operations for posts including creation, retrieval,
 * listing with pagination, updates, and deletion.
 */

import { TestBed } from '@angular/core/testing';
import { PostMockService } from './post-mock.service';
import { CreatePostRequest, UpdatePostRequest } from './types/requests.interface';
import { QueryParams } from './types/api-response.interface';

describe('PostMockService', () => {
  let service: PostMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createPost', () => {
    it('should create a new post successfully', (done) => {
      const request: CreatePostRequest = {
        title: 'Test Post',
        content: 'This is a test post content',
        organizationId: 'org-1'
      };

      service.createPost(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(201);
        expect(response.message).toBe('Post created successfully');
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.title).toBe(request.title);
          expect(response.data.content).toBe(request.content);
          expect(response.data.organizationId).toBe(request.organizationId);
          expect(response.data.id).toBeTruthy();
          expect(response.data.createdAt).toBeTruthy();
          expect(response.data.updatedAt).toBeTruthy();
          expect(response.data.isActive).toBe(true);
          expect(response.data.commentCount).toBe(0);
          expect(response.data.likeCount).toBe(0);
          expect(response.data.authorId).toBeTruthy();
        }
        done();
      });
    });

    it('should include author information in created post', (done) => {
      const request: CreatePostRequest = {
        title: 'Test Post',
        content: 'Content',
        organizationId: 'org-1'
      };

      service.createPost(request, { 'X-User-Id': 'user-1' }).subscribe(response => {
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.authorId).toBe('user-1');
          expect(response.data.author).toBeDefined();
          expect(response.data.author?.firstName).toBe('Alice');
        }
        done();
      });
    });

    it('should use default author when no header provided', (done) => {
      const request: CreatePostRequest = {
        title: 'Test Post',
        content: 'Content',
        organizationId: 'org-1'
      };

      service.createPost(request).subscribe(response => {
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.authorId).toBe('user-1');
        }
        done();
      });
    });

    it('should return 400 when title is missing', (done) => {
      const request: CreatePostRequest = {
        title: '',
        content: 'Content',
        organizationId: 'org-1'
      };

      service.createPost(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('Missing required fields');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should return 400 when content is missing', (done) => {
      const request: CreatePostRequest = {
        title: 'Test',
        content: '',
        organizationId: 'org-1'
      };

      service.createPost(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('Missing required fields');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should return 400 when organizationId is missing', (done) => {
      const request: CreatePostRequest = {
        title: 'Test',
        content: 'Content',
        organizationId: ''
      };

      service.createPost(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('Missing required fields');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should generate unique IDs for multiple posts', (done) => {
      const request: CreatePostRequest = {
        title: 'Test',
        content: 'Content',
        organizationId: 'org-1'
      };

      service.createPost(request).subscribe(response1 => {
        service.createPost(request).subscribe(response2 => {
          expect(response1.data?.id).not.toBe(response2.data?.id);
          done();
        });
      });
    });
  });

  describe('getPost', () => {
    it('should retrieve an existing post by ID', (done) => {
      service.getPost('post-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toBe('Post retrieved successfully');
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.id).toBe('post-1');
          expect(response.data.title).toBe('Welcome to Atlas Platform');
        }
        done();
      });
    });

    it('should include author information in retrieved post', (done) => {
      service.getPost('post-1').subscribe(response => {
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.author).toBeDefined();
          expect(response.data.author?.id).toBe('user-1');
          expect(response.data.author?.firstName).toBe('Alice');
        }
        done();
      });
    });

    it('should return 404 when post not found', (done) => {
      service.getPost('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        expect(response.message).toContain('not found');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should handle posts with different authors', (done) => {
      service.getPost('post-2').subscribe(response => {
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.authorId).toBe('user-2');
          expect(response.data.author?.firstName).toBe('Bob');
        }
        done();
      });
    });
  });

  describe('listPosts', () => {
    it('should return all active posts without parameters', (done) => {
      service.listPosts().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toBe('Posts retrieved successfully');
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should include author information for all posts', (done) => {
      service.listPosts().subscribe(response => {
        expect(response.data.length).toBeGreaterThan(0);
        response.data.forEach(post => {
          expect(post.author).toBeDefined();
          expect(post.author?.id).toBe(post.authorId);
        });
        done();
      });
    });

    it('should support pagination', (done) => {
      const params: QueryParams = {
        page: 1,
        pageSize: 5
      };

      service.listPosts(params).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.length).toBeLessThanOrEqual(5);
        expect(response.path).toContain('page=1');
        expect(response.path).toContain('pageSize=5');
        done();
      });
    });

    it('should return correct page of results', (done) => {
      const params: QueryParams = {
        page: 2,
        pageSize: 3
      };

      service.listPosts(params).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.length).toBeLessThanOrEqual(3);
        done();
      });
    });

    it('should filter by organizationId', (done) => {
      const params: QueryParams = {
        filter: { organizationId: 'org-1' }
      };

      service.listPosts(params).subscribe(response => {
        expect(response.success).toBe(true);
        response.data.forEach(post => {
          expect(post.organizationId).toBe('org-1');
        });
        done();
      });
    });

    it('should filter by authorId', (done) => {
      const params: QueryParams = {
        filter: { authorId: 'user-1' }
      };

      service.listPosts(params).subscribe(response => {
        expect(response.success).toBe(true);
        response.data.forEach(post => {
          expect(post.authorId).toBe('user-1');
        });
        done();
      });
    });

    it('should sort posts in ascending order', (done) => {
      const params: QueryParams = {
        sortBy: 'title',
        sortOrder: 'asc'
      };

      service.listPosts(params).subscribe(response => {
        expect(response.success).toBe(true);
        for (let i = 1; i < response.data.length; i++) {
          expect(response.data[i].title >= response.data[i - 1].title).toBe(true);
        }
        done();
      });
    });

    it('should sort posts in descending order', (done) => {
      const params: QueryParams = {
        sortBy: 'title',
        sortOrder: 'desc'
      };

      service.listPosts(params).subscribe(response => {
        expect(response.success).toBe(true);
        for (let i = 1; i < response.data.length; i++) {
          expect(response.data[i].title <= response.data[i - 1].title).toBe(true);
        }
        done();
      });
    });

    it('should combine filtering and pagination', (done) => {
      const params: QueryParams = {
        filter: { organizationId: 'org-1' },
        page: 1,
        pageSize: 2
      };

      service.listPosts(params).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.length).toBeLessThanOrEqual(2);
        response.data.forEach(post => {
          expect(post.organizationId).toBe('org-1');
        });
        done();
      });
    });

    it('should return empty array when no posts match filter', (done) => {
      const params: QueryParams = {
        filter: { organizationId: 'non-existent-org' }
      };

      service.listPosts(params).subscribe(response => {
        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBe(0);
        done();
      });
    });
  });

  describe('updatePost', () => {
    it('should update post title successfully', (done) => {
      const request: UpdatePostRequest = {
        title: 'Updated Title'
      };

      service.updatePost('post-1', request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toBe('Post updated successfully');
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.title).toBe('Updated Title');
          expect(response.data.id).toBe('post-1');
        }
        done();
      });
    });

    it('should update post content successfully', (done) => {
      const request: UpdatePostRequest = {
        content: 'Updated content'
      };

      service.updatePost('post-1', request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.content).toBe('Updated content');
        }
        done();
      });
    });

    it('should update both title and content', (done) => {
      const request: UpdatePostRequest = {
        title: 'New Title',
        content: 'New Content'
      };

      service.updatePost('post-1', request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.title).toBe('New Title');
          expect(response.data.content).toBe('New Content');
        }
        done();
      });
    });

    it('should update updatedAt timestamp', (done) => {
      const request: UpdatePostRequest = {
        title: 'Updated'
      };

      service.getPost('post-1').subscribe(originalResponse => {
        const originalUpdatedAt = originalResponse.data?.updatedAt;
        
        // Small delay to ensure timestamp difference
        setTimeout(() => {
          service.updatePost('post-1', request).subscribe(updateResponse => {
            expect(updateResponse.data?.updatedAt).not.toBe(originalUpdatedAt);
            done();
          });
        }, 10);
      });
    });

    it('should include author information in updated post', (done) => {
      const request: UpdatePostRequest = {
        title: 'Updated'
      };

      service.updatePost('post-1', request).subscribe(response => {
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.author).toBeDefined();
          expect(response.data.author?.id).toBe(response.data.authorId);
        }
        done();
      });
    });

    it('should return 404 when post not found', (done) => {
      const request: UpdatePostRequest = {
        title: 'Updated'
      };

      service.updatePost('non-existent-id', request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        expect(response.message).toContain('not found');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should preserve unchanged fields', (done) => {
      const request: UpdatePostRequest = {
        title: 'Only Title Updated'
      };

      service.getPost('post-1').subscribe(originalResponse => {
        const originalContent = originalResponse.data?.content;
        
        service.updatePost('post-1', request).subscribe(updateResponse => {
          expect(updateResponse.data?.content).toBe(originalContent);
          done();
        });
      });
    });
  });

  describe('deletePost', () => {
    it('should delete post successfully', (done) => {
      service.deletePost('post-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toBe('Post deleted successfully');
        done();
      });
    });

    it('should return 404 when post not found', (done) => {
      service.deletePost('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        expect(response.message).toContain('not found');
        expect(response.data).toBeNull();
        done();
      });
    });
  });

  describe('ApiResponse structure', () => {
    it('should include all required ApiResponse fields', (done) => {
      const request: CreatePostRequest = {
        title: 'Test',
        content: 'Content',
        organizationId: 'org-1'
      };

      service.createPost(request).subscribe(response => {
        expect(response.success).toBeDefined();
        expect(response.status).toBeDefined();
        expect(response.message).toBeDefined();
        expect(response.data).toBeDefined();
        expect(response.timestamp).toBeDefined();
        expect(response.path).toBeDefined();
        expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        done();
      });
    });

    it('should have valid ISO 8601 timestamp format', (done) => {
      service.getPost('post-1').subscribe(response => {
        expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        done();
      });
    });
  });
});
