/**
 * Access Mock Service
 * 
 * Provides mock implementations for ACCESS module endpoints including
 * access code generation and QR validation operations.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { AccessCode } from './types/entities.interface';
import { CreateAccessCodeRequest, ValidateQRRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp, generateUniqueCode } from './utils/generators';
import { MOCK_ACCESS_CODES } from './data/mock-access-codes.data';

@Injectable({ providedIn: 'root' })
export class AccessMockService {

  generateAccessCode(request: CreateAccessCodeRequest, headers?: { 'X-User-Id'?: string }): Observable<ApiResponse<AccessCode | null>> {
    if (!request.userId || !request.organizationId || !request.validFrom || !request.validUntil || request.maxUsages === undefined) {
      return of(buildErrorResponse('/api/access/generate', 400, 'Missing required fields: userId, organizationId, validFrom, validUntil, and maxUsages are required'));
    }

    const now = generateTimestamp();
    const newAccessCode: AccessCode = {
      id: generateId(),
      code: `QR-${generateUniqueCode()}`,
      userId: request.userId,
      organizationId: request.organizationId,
      validFrom: request.validFrom,
      validUntil: request.validUntil,
      usageCount: 0,
      maxUsages: request.maxUsages,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    return of(buildApiResponse(newAccessCode, '/api/access/generate', 201, 'Access code generated successfully'));
  }

  getAccessCode(id: string): Observable<ApiResponse<AccessCode | null>> {
    const accessCode = MOCK_ACCESS_CODES.find(ac => ac.id === id && ac.isActive);
    if (!accessCode) {
      return of(buildErrorResponse(`/api/access/${id}`, 404, `Access code with id ${id} not found`));
    }
    return of(buildApiResponse(accessCode, `/api/access/${id}`, 200, 'Access code retrieved successfully'));
  }

  validateQRCode(request: ValidateQRRequest): Observable<ApiResponse<{ valid: boolean; message: string; accessCode?: AccessCode } | null>> {
    const accessCode = MOCK_ACCESS_CODES.find(ac => ac.code === request.code && ac.organizationId === request.organizationId);
    
    if (!accessCode) {
      return of(buildApiResponse(
        { valid: false, message: 'Access code not found' },
        '/api/access/validate',
        200,
        'Validation completed'
      ));
    }

    if (!accessCode.isActive) {
      return of(buildApiResponse(
        { valid: false, message: 'Access code is inactive' },
        '/api/access/validate',
        200,
        'Validation completed'
      ));
    }

    const now = new Date();
    const validFrom = new Date(accessCode.validFrom);
    const validUntil = new Date(accessCode.validUntil);

    if (now < validFrom) {
      return of(buildApiResponse(
        { valid: false, message: 'Access code not yet valid' },
        '/api/access/validate',
        200,
        'Validation completed'
      ));
    }

    if (now > validUntil) {
      return of(buildApiResponse(
        { valid: false, message: 'Access code has expired' },
        '/api/access/validate',
        200,
        'Validation completed'
      ));
    }

    if (accessCode.usageCount >= accessCode.maxUsages) {
      return of(buildApiResponse(
        { valid: false, message: 'Access code usage limit reached' },
        '/api/access/validate',
        200,
        'Validation completed'
      ));
    }

    return of(buildApiResponse(
      { valid: true, message: 'Access code is valid', accessCode: accessCode },
      '/api/access/validate',
      200,
      'Validation completed'
    ));
  }

  listAccessCodes(params?: { filter?: { userId?: string; organizationId?: string } }): Observable<ApiResponse<AccessCode[]>> {
    let accessCodes = MOCK_ACCESS_CODES.filter(ac => ac.isActive);

    if (params?.filter) {
      if (params.filter.userId) {
        accessCodes = accessCodes.filter(ac => ac.userId === params.filter!.userId);
      }
      if (params.filter.organizationId) {
        accessCodes = accessCodes.filter(ac => ac.organizationId === params.filter!.organizationId);
      }
    }

    return of(buildApiResponse(accessCodes, '/api/access', 200, 'Access codes retrieved successfully'));
  }
}
