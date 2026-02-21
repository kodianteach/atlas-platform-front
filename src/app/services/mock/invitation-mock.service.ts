/**
 * Invitation Mock Service
 * 
 * Provides mock implementations for INVITATION module endpoints including
 * invitation operations with unique codes and status management.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { Invitation, InvitationStatus } from './types/entities.interface';
import { CreateInvitationRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp, generateUniqueCode } from './utils/generators';
import { MOCK_INVITATIONS } from './data/mock-invitations.data';

@Injectable({ providedIn: 'root' })
export class InvitationMockService {

  createInvitation(request: CreateInvitationRequest, headers?: { 'X-User-Id'?: string }): Observable<ApiResponse<Invitation | null>> {
    if (!request.email || !request.organizationId || !request.expiresAt) {
      return of(buildErrorResponse('/api/invitations', 400, 'Missing required fields: email, organizationId, and expiresAt are required'));
    }

    const invitedBy = headers?.['X-User-Id'] || 'user-1';
    const now = generateTimestamp();
    const newInvitation: Invitation = {
      id: generateId(),
      email: request.email,
      organizationId: request.organizationId,
      invitedBy: invitedBy,
      code: `INV-${generateUniqueCode()}`,
      status: InvitationStatus.PENDING,
      expiresAt: request.expiresAt,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    return of(buildApiResponse(newInvitation, '/api/invitations', 201, 'Invitation created successfully'));
  }

  getInvitation(id: string): Observable<ApiResponse<Invitation | null>> {
    const invitation = MOCK_INVITATIONS.find(i => i.id === id && i.isActive);
    if (!invitation) {
      return of(buildErrorResponse(`/api/invitations/${id}`, 404, `Invitation with id ${id} not found`));
    }
    return of(buildApiResponse(invitation, `/api/invitations/${id}`, 200, 'Invitation retrieved successfully'));
  }

  listInvitations(params?: { filter?: { organizationId?: string; status?: InvitationStatus } }): Observable<ApiResponse<Invitation[]>> {
    let invitations = MOCK_INVITATIONS.filter(i => i.isActive);

    if (params?.filter) {
      if (params.filter.organizationId) {
        invitations = invitations.filter(i => i.organizationId === params.filter!.organizationId);
      }
      if (params.filter.status) {
        invitations = invitations.filter(i => i.status === params.filter!.status);
      }
    }

    return of(buildApiResponse(invitations, '/api/invitations', 200, 'Invitations retrieved successfully'));
  }

  acceptInvitation(id: string): Observable<ApiResponse<Invitation | null>> {
    const invitation = MOCK_INVITATIONS.find(i => i.id === id && i.isActive);
    if (!invitation) {
      return of(buildErrorResponse(`/api/invitations/${id}/accept`, 404, `Invitation with id ${id} not found`));
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      return of(buildErrorResponse(`/api/invitations/${id}/accept`, 400, 'Only pending invitations can be accepted'));
    }

    const acceptedInvitation: Invitation = {
      ...invitation,
      status: InvitationStatus.ACCEPTED,
      updatedAt: generateTimestamp()
    };

    return of(buildApiResponse(acceptedInvitation, `/api/invitations/${id}/accept`, 200, 'Invitation accepted successfully'));
  }

  getInvitationStatus(id: string): Observable<ApiResponse<{ status: InvitationStatus } | null>> {
    const invitation = MOCK_INVITATIONS.find(i => i.id === id && i.isActive);
    if (!invitation) {
      return of(buildErrorResponse(`/api/invitations/${id}/status`, 404, `Invitation with id ${id} not found`));
    }
    return of(buildApiResponse({ status: invitation.status }, `/api/invitations/${id}/status`, 200, 'Invitation status retrieved successfully'));
  }
}
