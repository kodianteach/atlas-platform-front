/**
 * Zone Mock Service
 * 
 * Provides mock implementations for ZONE module endpoints including
 * CRUD operations for zones with boundaries and access control data.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { Zone } from './types/entities.interface';
import { CreateZoneRequest, UpdateZoneRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_ZONES } from './data/mock-zones.data';

@Injectable({ providedIn: 'root' })
export class ZoneMockService {

  createZone(request: CreateZoneRequest, headers?: { 'X-User-Id'?: string }): Observable<ApiResponse<Zone | null>> {
    if (!request.name || !request.organizationId || !request.type || !request.description) {
      return of(buildErrorResponse('/api/zones', 400, 'Missing required fields: name, organizationId, type, and description are required'));
    }

    const now = generateTimestamp();
    const newZone: Zone = {
      id: generateId(),
      name: request.name,
      organizationId: request.organizationId,
      type: request.type,
      description: request.description,
      boundaries: request.boundaries,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    return of(buildApiResponse(newZone, '/api/zones', 201, 'Zone created successfully'));
  }

  getZone(id: string): Observable<ApiResponse<Zone | null>> {
    const zone = MOCK_ZONES.find(z => z.id === id && z.isActive);
    if (!zone) {
      return of(buildErrorResponse(`/api/zones/${id}`, 404, `Zone with id ${id} not found`));
    }
    return of(buildApiResponse(zone, `/api/zones/${id}`, 200, 'Zone retrieved successfully'));
  }

  listZones(params?: { filter?: { organizationId?: string; type?: string } }): Observable<ApiResponse<Zone[]>> {
    let zones = MOCK_ZONES.filter(z => z.isActive);

    if (params?.filter) {
      if (params.filter.organizationId) {
        zones = zones.filter(z => z.organizationId === params.filter!.organizationId);
      }
      if (params.filter.type) {
        zones = zones.filter(z => z.type === params.filter!.type);
      }
    }

    return of(buildApiResponse(zones, '/api/zones', 200, 'Zones retrieved successfully'));
  }

  updateZone(id: string, request: UpdateZoneRequest): Observable<ApiResponse<Zone | null>> {
    const zone = MOCK_ZONES.find(z => z.id === id && z.isActive);
    if (!zone) {
      return of(buildErrorResponse(`/api/zones/${id}`, 404, `Zone with id ${id} not found`));
    }

    const updatedZone: Zone = {
      ...zone,
      name: request.name !== undefined ? request.name : zone.name,
      type: request.type !== undefined ? request.type : zone.type,
      description: request.description !== undefined ? request.description : zone.description,
      boundaries: request.boundaries !== undefined ? request.boundaries : zone.boundaries,
      updatedAt: generateTimestamp()
    };

    return of(buildApiResponse(updatedZone, `/api/zones/${id}`, 200, 'Zone updated successfully'));
  }

  deleteZone(id: string): Observable<ApiResponse<void | null>> {
    const zone = MOCK_ZONES.find(z => z.id === id && z.isActive);
    if (!zone) {
      return of(buildErrorResponse(`/api/zones/${id}`, 404, `Zone with id ${id} not found`));
    }
    return of(buildApiResponse(undefined as void, `/api/zones/${id}`, 200, 'Zone deleted successfully'));
  }
}
