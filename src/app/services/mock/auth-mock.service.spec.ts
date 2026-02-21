/**
 * Unit Tests for AuthMockService
 * 
 * Tests authentication endpoints including registration, login,
 * token refresh, and verification with various scenarios.
 */

import { TestBed } from '@angular/core/testing';
import { AuthMockService } from './auth-mock.service';
import { RegisterRequest, LoginRequest } from './types/requests.interface';

describe('AuthMockService', () => {
  let service: AuthMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a new user successfully', (done) => {
      const request: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        organizationId: 'org-1'
      };

      service.register(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(201);
        expect(response.message).toBe('User registered successfully');
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.user.email).toBe(request.email);
          expect(response.data.user.firstName).toBe(request.firstName);
          expect(response.data.user.lastName).toBe(request.lastName);
          expect(response.data.user.organizationId).toBe(request.organizationId);
          expect(response.data.user.id).toBeTruthy();
          expect(response.data.user.createdAt).toBeTruthy();
          expect(response.data.user.updatedAt).toBeTruthy();
          expect(response.data.user.isActive).toBe(true);
          expect(response.data.accessToken).toBeTruthy();
          expect(response.data.refreshToken).toBeTruthy();
          expect(response.data.expiresIn).toBe(3600);
        }
        done();
      });
    });

    it('should return 409 when email already exists', (done) => {
      const request: RegisterRequest = {
        email: 'admin@atlas.com', // Existing user from mock data
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      service.register(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(409);
        expect(response.message).toBe('Email already registered');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should return 400 when required fields are missing', (done) => {
      const request: RegisterRequest = {
        email: 'test@example.com',
        password: '',
        firstName: 'Test',
        lastName: 'User'
      };

      service.register(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('Missing required fields');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should handle registration without organizationId', (done) => {
      const request: RegisterRequest = {
        email: 'noorg@example.com',
        password: 'password123',
        firstName: 'No',
        lastName: 'Org'
      };

      service.register(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(201);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.user.organizationId).toBeUndefined();
        }
        done();
      });
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', (done) => {
      const request: LoginRequest = {
        email: 'admin@atlas.com',
        password: 'anypassword' // Mock service accepts any password
      };

      service.login(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toBe('Login successful');
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.user.email).toBe(request.email);
          expect(response.data.user.firstName).toBe('Alice');
          expect(response.data.accessToken).toBeTruthy();
          expect(response.data.refreshToken).toBeTruthy();
          expect(response.data.expiresIn).toBe(3600);
        }
        done();
      });
    });

    it('should return 401 for non-existent email', (done) => {
      const request: LoginRequest = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      service.login(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(401);
        expect(response.message).toBe('Invalid email or password');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should return 401 for inactive user', (done) => {
      const request: LoginRequest = {
        email: 'hannah.inactive@example.com', // Inactive user from mock data
        password: 'password123'
      };

      service.login(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(401);
        expect(response.message).toBe('Invalid email or password');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should return 400 when email is missing', (done) => {
      const request: LoginRequest = {
        email: '',
        password: 'password123'
      };

      service.login(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('Missing required fields');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should return 400 when password is missing', (done) => {
      const request: LoginRequest = {
        email: 'admin@atlas.com',
        password: ''
      };

      service.login(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('Missing required fields');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should be case-insensitive for email', (done) => {
      const request: LoginRequest = {
        email: 'ADMIN@ATLAS.COM',
        password: 'password'
      };

      service.login(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.user.email).toBe('admin@atlas.com');
        }
        done();
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', (done) => {
      const refreshToken = 'mock-refresh-token-user-1';

      service.refreshToken(refreshToken).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toBe('Token refreshed successfully');
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.accessToken).toBeTruthy();
          expect(response.data.refreshToken).toBeTruthy();
          expect(response.data.expiresIn).toBe(3600);
          expect(response.data.accessToken).toContain('refreshed');
          expect(response.data.refreshToken).toContain('refreshed');
        }
        done();
      });
    });

    it('should return 400 when refresh token is missing', (done) => {
      service.refreshToken('').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toBe('Refresh token is required');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should handle any valid refresh token format', (done) => {
      const refreshToken = 'mock-refresh-token-xyz-123';

      service.refreshToken(refreshToken).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.accessToken).toBeTruthy();
          expect(response.data.refreshToken).toBeTruthy();
        }
        done();
      });
    });
  });

  describe('verify', () => {
    it('should verify valid token successfully', (done) => {
      const accessToken = 'mock-access-token-user-1';

      service.verify(accessToken).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.verified).toBe(true);
          expect(response.data.userId).toBe('user-1');
          expect(response.data.email).toBe('admin@atlas.com');
          expect(response.data.message).toBe('Token is valid');
        }
        done();
      });
    });

    it('should return unverified for invalid token format', (done) => {
      const accessToken = 'invalid-token-format';

      service.verify(accessToken).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.verified).toBe(false);
          expect(response.data.message).toBe('Invalid token format');
          expect(response.data.userId).toBeUndefined();
          expect(response.data.email).toBeUndefined();
        }
        done();
      });
    });

    it('should return unverified for non-existent user', (done) => {
      const accessToken = 'mock-access-token-nonexistent-user';

      service.verify(accessToken).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.verified).toBe(false);
          expect(response.data.message).toBe('User not found or inactive');
          expect(response.data.userId).toBeUndefined();
          expect(response.data.email).toBeUndefined();
        }
        done();
      });
    });

    it('should return unverified for inactive user', (done) => {
      const accessToken = 'mock-access-token-user-8'; // user-8 is inactive

      service.verify(accessToken).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.verified).toBe(false);
          expect(response.data.message).toBe('User not found or inactive');
        }
        done();
      });
    });

    it('should return 400 when access token is missing', (done) => {
      service.verify('').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toBe('Access token is required');
        expect(response.data).toBeNull();
        done();
      });
    });

    it('should handle tokens with additional segments', (done) => {
      const accessToken = 'mock-access-token-user-2-refreshed';

      service.verify(accessToken).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).not.toBeNull();
        if (response.data) {
          expect(response.data.verified).toBe(true);
          expect(response.data.userId).toBe('user-2');
        }
        done();
      });
    });
  });

  describe('ApiResponse structure', () => {
    it('should include all required ApiResponse fields', (done) => {
      const request: LoginRequest = {
        email: 'admin@atlas.com',
        password: 'password'
      };

      service.login(request).subscribe(response => {
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
  });
});
