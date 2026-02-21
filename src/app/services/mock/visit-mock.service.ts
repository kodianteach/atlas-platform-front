/**
 * Visit Mock Service
 * 
 * Provides mock implementations for VISIT module endpoints including
 * visit request operations with approval workflow.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { Visit, VisitStatus } from './types/entities.interface';
import { CreateVisitRequest, UpdateVisitRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_VISITS } from './data/mock-visits.data';

@Injectable({ providedIn: 'root' })
export class VisitMockService {

  createVisit(request: CreateVisitRequest, headers?: { 'X-User-Id'?: string }): Observable<ApiResponse<Visit | null>> {
    if (!request.visitorName || !request.visitorDocument || !request.unitId || !request.scheduledDate) {
      return of(buildErrorResponse('/api/visits', 400, 'Missing required fields: visitorName, visitorDocument, unitId, and scheduledDate are required'));
    }

    const requestedBy = headers?.['X-User-Id'] || 'user-1';
    const now = generateTimestamp();
    const newVisit: Visit = {
      id: generateId(),
      visitorName: request.visitorName,
      visitorDocument: request.visitorDocument,
      unitId: request.unitId,
      requestedBy: requestedBy,
      scheduledDate: request.scheduledDate,
      status: VisitStatus.PENDING,
      approvedBy: undefined,
      approvedAt: undefined,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    return of(buildApiResponse(newVisit, '/api/visits', 201, 'Visit created successfully'));
  }

  getVisit(id: string): Observable<ApiResponse<Visit | null>> {
    const visit = MOCK_VISITS.find(v => v.id === id && v.isActive);
    if (!visit) {
      return of(buildErrorResponse(`/api/visits/${id}`, 404, `Visit with id ${id} not found`));
    }
    return of(buildApiResponse(visit, `/api/visits/${id}`, 200, 'Visit retrieved successfully'));
  }

  listVisits(params?: { filter?: { unitId?: string; status?: VisitStatus } }): Observable<ApiResponse<Visit[]>> {
    let visits = MOCK_VISITS.filter(v => v.isActive);

    if (params?.filter) {
      if (params.filter.unitId) {
        visits = visits.filter(v => v.unitId === params.filter!.unitId);
      }
      if (params.filter.status) {
        visits = visits.filter(v => v.status === params.filter!.status);
      }
    }

    return of(buildApiResponse(visits, '/api/visits', 200, 'Visits retrieved successfully'));
  }

  approveVisit(id: string, headers?: { 'X-User-Id'?: string }): Observable<ApiResponse<Visit | null>> {
    const visit = MOCK_VISITS.find(v => v.id === id && v.isActive);
    if (!visit) {
      return of(buildErrorResponse(`/api/visits/${id}/approve`, 404, `Visit with id ${id} not found`));
    }

    const approvedBy = headers?.['X-User-Id'] || 'user-1';
    const now = generateTimestamp();
    const approvedVisit: Visit = {
      ...visit,
      status: VisitStatus.APPROVED,
      approvedBy: approvedBy,
      approvedAt: now,
      updatedAt: now
    };

    return of(buildApiResponse(approvedVisit, `/api/visits/${id}/approve`, 200, 'Visit approved successfully'));
  }

  rejectVisit(id: string, headers?: { 'X-User-Id'?: string }): Observable<ApiResponse<Visit | null>> {
    const visit = MOCK_VISITS.find(v => v.id === id && v.isActive);
    if (!visit) {
      return of(buildErrorResponse(`/api/visits/${id}/reject`, 404, `Visit with id ${id} not found`));
    }

    const approvedBy = headers?.['X-User-Id'] || 'user-1';
    const now = generateTimestamp();
    const rejectedVisit: Visit = {
      ...visit,
      status: VisitStatus.REJECTED,
      approvedBy: approvedBy,
      approvedAt: now,
      updatedAt: now
    };

    return of(buildApiResponse(rejectedVisit, `/api/visits/${id}/reject`, 200, 'Visit rejected successfully'));
  }

  updateVisit(id: string, request: UpdateVisitRequest): Observable<ApiResponse<Visit | null>> {
    const visit = MOCK_VISITS.find(v => v.id === id && v.isActive);
    if (!visit) {
      return of(buildErrorResponse(`/api/visits/${id}`, 404, `Visit with id ${id} not found`));
    }

    const updatedVisit: Visit = {
      ...visit,
      scheduledDate: request.scheduledDate !== undefined ? request.scheduledDate : visit.scheduledDate,
      status: request.status !== undefined ? request.status as VisitStatus : visit.status,
      updatedAt: generateTimestamp()
    };

    return of(buildApiResponse(updatedVisit, `/api/visits/${id}`, 200, 'Visit updated successfully'));
  }
}
