/**
 * Auth Mock Service
 * 
 * Provides mock implementations for authentication endpoints including
 * user registration, login, token refresh, and verification.
 * 
 * All methods return Observable<ApiResponse<T>> to match real HTTP service patterns.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { User } from './types/entities.interface';
import { LoginRequest, RegisterRequest } from './types/requests.interface';
import { AuthResponse, TokenRefreshResponse, VerificationResponse } from './types/responses.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_USERS } from './data/mock-users.data';

@Injectable({ providedIn: 'root' })
export class AuthMockService {

  /**
   * Register a new user
   * 
   * Creates a new user account and returns authentication tokens.
   * Validates that email is not already registered.
   * 
   * @param request - Registration details (email, password, firstName, lastName, organizationId)
   * @returns Observable<ApiResponse<AuthResponse>> with user and tokens
   */
  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse | null>> {
    // Validate required fields
    if (!request.email || !request.password || !request.firstName || !request.lastName) {
      return of(buildErrorResponse(
        '/api/auth/register',
        400,
        'Missing required fields: email, password, firstName, and lastName are required'
      ));
    }

    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === request.email.toLowerCase());
    if (existingUser) {
      return of(buildErrorResponse(
        '/api/auth/register',
        409,
        'Email already registered'
      ));
    }

    // Create new user
    const now = generateTimestamp();
    const newUser: User = {
      id: generateId(),
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      role: 'resident', // Default role for new registrations
      organizationId: request.organizationId,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    // Generate authentication tokens
    const authResponse: AuthResponse = {
      user: newUser,
      accessToken: `mock-access-token-${newUser.id}`,
      refreshToken: `mock-refresh-token-${newUser.id}`,
      expiresIn: 3600 // 1 hour in seconds
    };

    return of(buildApiResponse(
      authResponse,
      '/api/auth/register',
      201,
      'User registered successfully'
    ));
  }

  /**
   * Login with email and password
   * 
   * Validates credentials and returns authentication tokens.
   * For mock purposes, any password is accepted for existing users.
   * 
   * @param request - Login credentials (email, password)
   * @returns Observable<ApiResponse<AuthResponse>> with user and tokens
   */
  login(request: LoginRequest): Observable<ApiResponse<AuthResponse | null>> {
    // Validate required fields
    if (!request.email || !request.password) {
      return of(buildErrorResponse(
        '/api/auth/login',
        400,
        'Missing required fields: email and password are required'
      ));
    }

    // Find user by email
    const user = MOCK_USERS.find(u => 
      u.email.toLowerCase() === request.email.toLowerCase() && u.isActive
    );

    if (!user) {
      return of(buildErrorResponse(
        '/api/auth/login',
        401,
        'Invalid email or password'
      ));
    }

    // For mock service, accept any password for existing users
    // In real implementation, password would be validated

    // Generate authentication tokens
    const authResponse: AuthResponse = {
      user: user,
      accessToken: `mock-access-token-${user.id}`,
      refreshToken: `mock-refresh-token-${user.id}`,
      expiresIn: 3600 // 1 hour in seconds
    };

    return of(buildApiResponse(
      authResponse,
      '/api/auth/login',
      200,
      'Login successful'
    ));
  }

  /**
   * Refresh authentication tokens
   * 
   * Generates new access and refresh tokens using a valid refresh token.
   * For mock purposes, any non-empty refresh token is accepted.
   * 
   * @param refreshToken - Current refresh token
   * @returns Observable<ApiResponse<TokenRefreshResponse>> with new tokens
   */
  refreshToken(refreshToken: string): Observable<ApiResponse<TokenRefreshResponse | null>> {
    // Validate refresh token is provided
    if (!refreshToken) {
      return of(buildErrorResponse(
        '/api/auth/refresh',
        400,
        'Refresh token is required'
      ));
    }

    // For mock service, accept any non-empty refresh token
    // In real implementation, token would be validated and decoded

    // Extract user ID from mock token format (mock-refresh-token-{userId})
    const userId = refreshToken.replace('mock-refresh-token-', '');

    // Generate new tokens
    const tokenResponse: TokenRefreshResponse = {
      accessToken: `mock-access-token-${userId}-refreshed`,
      refreshToken: `mock-refresh-token-${userId}-refreshed`,
      expiresIn: 3600 // 1 hour in seconds
    };

    return of(buildApiResponse(
      tokenResponse,
      '/api/auth/refresh',
      200,
      'Token refreshed successfully'
    ));
  }

  /**
   * Verify authentication token
   * 
   * Validates an access token and returns verification status with user information.
   * For mock purposes, tokens in format "mock-access-token-{userId}" are validated.
   * 
   * @param accessToken - Access token to verify
   * @returns Observable<ApiResponse<VerificationResponse>> with verification status
   */
  verify(accessToken: string): Observable<ApiResponse<VerificationResponse | null>> {
    // Validate access token is provided
    if (!accessToken) {
      return of(buildErrorResponse(
        '/api/auth/verify',
        400,
        'Access token is required'
      ));
    }

    // For mock service, validate token format and extract user ID
    if (!accessToken.startsWith('mock-access-token-')) {
      const verificationResponse: VerificationResponse = {
        verified: false,
        message: 'Invalid token format'
      };

      return of(buildApiResponse(
        verificationResponse,
        '/api/auth/verify',
        200,
        'Token verification completed'
      ));
    }

    // Extract user ID from token
    // Token format: mock-access-token-{userId} or mock-access-token-{userId}-{suffix}
    const tokenWithoutPrefix = accessToken.replace('mock-access-token-', '');
    
    // Try to find a matching user by checking if the token starts with their ID
    const user = MOCK_USERS.find(u => 
      u.isActive && tokenWithoutPrefix.startsWith(u.id)
    );

    if (!user) {
      const verificationResponse: VerificationResponse = {
        verified: false,
        message: 'User not found or inactive'
      };

      return of(buildApiResponse(
        verificationResponse,
        '/api/auth/verify',
        200,
        'Token verification completed'
      ));
    }

    // Token is valid
    const verificationResponse: VerificationResponse = {
      verified: true,
      userId: user.id,
      email: user.email,
      message: 'Token is valid'
    };

    return of(buildApiResponse(
      verificationResponse,
      '/api/auth/verify',
      200,
      'Token verification completed'
    ));
  }
}
