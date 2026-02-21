/**
 * External Mock Service
 * 
 * Provides mock implementations for EXTERNAL module endpoints including
 * external admin pre-registration operations.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { ExternalPreRegistrationRequest, ExternalValidationRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp, generateUniqueCode } from './utils/generators';

@Injectable({ providedIn: 'root' })
export class ExternalMockService {

  preRegister(request: ExternalPreRegistrationRequest): Observable<ApiResponse<{ registrationId: string; token: string; status: string } | null>> {
    if (!request.email || !request.firstName || !request.lastName || !request.organizationId || !request.role) {
      return of(buildErrorResponse(
        '/api/external/pre-register',
        400,
        'Missing required fields: email, firstName, lastName, organizationId, and role are required'
      ));
    }

    const registrationId = generateId();
    const token = `EXT-${generateUniqueCode()}`;
    
    const registrationData = {
      registrationId: registrationId,
      token: token,
      status: 'PENDING_VERIFICATION'
    };

    return of(buildApiResponse(
      registrationData,
      '/api/external/pre-register',
      201,
      'Pre-registration completed successfully'
    ));
  }

  validateExternalAdmin(request: ExternalValidationRequest): Observable<ApiResponse<{ valid: boolean; message: string; email?: string } | null>> {
    if (!request.token || !request.organizationId) {
      return of(buildErrorResponse(
        '/api/external/validate',
        400,
        'Missing required fields: token and organizationId are required'
      ));
    }

    // Mock validation logic - in real implementation, this would check against a database
    const isValidToken = request.token.startsWith('EXT-');
    
    if (!isValidToken) {
      return of(buildApiResponse(
        { valid: false, message: 'Invalid token format' },
        '/api/external/validate',
        200,
        'Validation completed'
      ));
    }

    return of(buildApiResponse(
      { 
        valid: true, 
        message: 'Token is valid',
        email: 'external.admin@example.com'
      },
      '/api/external/validate',
      200,
      'Validation completed'
    ));
  }

  getPreRegistrationStatus(registrationId: string): Observable<ApiResponse<{ status: string; email: string; organizationId: string } | null>> {
    if (!registrationId) {
      return of(buildErrorResponse(
        '/api/external/status',
        400,
        'Registration ID is required'
      ));
    }

    // Mock status data
    const statusData = {
      status: 'PENDING_VERIFICATION',
      email: 'external.admin@example.com',
      organizationId: 'org-1'
    };

    return of(buildApiResponse(
      statusData,
      `/api/external/status/${registrationId}`,
      200,
      'Pre-registration status retrieved successfully'
    ));
  }
}
