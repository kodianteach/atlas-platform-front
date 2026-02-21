/**
 * Tower Mock Service
 * 
 * Provides mock implementations for TOWER module endpoints including
 * CRUD operations for towers with location information and status management.
 * 
 * All methods return Observable<ApiResponse<T>> to match real HTTP service patterns.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { Tower, Status } from './types/entities.interface';
import { CreateTowerRequest, UpdateTowerRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_TOWERS } from './data/mock-towers.data';

@Injectable({ providedIn: 'root' })
export class TowerMockService {

  /**
   * Create a new tower
   * 
   * Creates a new tower with generated ID and audit fields.
   * Sets initial status to PENDING.
   * 
   * @param request - Tower creation details (name, organizationId, address, latitude, longitude)
   * @param headers - Optional request headers
   * @returns Observable<ApiResponse<Tower>> with created tower
   */
  createTower(
    request: CreateTowerRequest,
    headers?: { 'X-User-Id'?: string }
  ): Observable<ApiResponse<Tower | null>> {
    // Validate required fields
    if (!request.name || !request.organizationId || !request.address || 
        request.latitude === undefined || request.longitude === undefined) {
      return of(buildErrorResponse(
        '/api/towers',
        400,
        'Missing required fields: name, organizationId, address, latitude, and longitude are required'
      ));
    }

    // Validate coordinates
    if (request.latitude < -90 || request.latitude > 90) {
      return of(buildErrorResponse(
        '/api/towers',
        400,
        'Invalid latitude: must be between -90 and 90'
      ));
    }

    if (request.longitude < -180 || request.longitude > 180) {
      return of(buildErrorResponse(
        '/api/towers',
        400,
        'Invalid longitude: must be between -180 and 180'
      ));
    }

    // Create new tower with generated ID and audit fields
    const now = generateTimestamp();
    const newTower: Tower = {
      id: generateId(),
      name: request.name,
      organizationId: request.organizationId,
      address: request.address,
      latitude: request.latitude,
      longitude: request.longitude,
      status: Status.PENDING,
      unitCount: 0,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    return of(buildApiResponse(
      newTower,
      '/api/towers',
      201,
      'Tower created successfully'
    ));
  }

  /**
   * Get a single tower by ID
   * 
   * Retrieves complete tower data with location information.
   * Returns 404 if tower not found.
   * 
   * @param id - Tower ID
   * @returns Observable<ApiResponse<Tower>> with tower data
   */
  getTower(id: string): Observable<ApiResponse<Tower | null>> {
    // Find tower by ID
    const tower = MOCK_TOWERS.find(t => t.id === id && t.isActive);

    if (!tower) {
      return of(buildErrorResponse(
        `/api/towers/${id}`,
        404,
        `Tower with id ${id} not found`
      ));
    }

    return of(buildApiResponse(
      tower,
      `/api/towers/${id}`,
      200,
      'Tower retrieved successfully'
    ));
  }

  /**
   * List all towers
   * 
   * Returns array of all active towers with location and status information.
   * Supports filtering by organizationId and status.
   * 
   * @param params - Optional query parameters for filtering
   * @returns Observable<ApiResponse<Tower[]>> with array of towers
   */
  listTowers(
    params?: { filter?: { organizationId?: string; status?: Status } }
  ): Observable<ApiResponse<Tower[]>> {
    // Start with active towers
    let towers = MOCK_TOWERS.filter(t => t.isActive);

    // Apply filtering if provided
    if (params?.filter) {
      if (params.filter.organizationId) {
        towers = towers.filter(t => t.organizationId === params.filter!.organizationId);
      }
      if (params.filter.status) {
        towers = towers.filter(t => t.status === params.filter!.status);
      }
    }

    return of(buildApiResponse(
      towers,
      '/api/towers',
      200,
      'Towers retrieved successfully'
    ));
  }

  /**
   * Update an existing tower
   * 
   * Updates tower fields and refreshes updatedAt timestamp.
   * Returns 404 if tower not found.
   * 
   * @param id - Tower ID
   * @param request - Update details (name, address, latitude, longitude, status)
   * @returns Observable<ApiResponse<Tower>> with updated tower
   */
  updateTower(
    id: string,
    request: UpdateTowerRequest
  ): Observable<ApiResponse<Tower | null>> {
    // Find tower by ID
    const tower = MOCK_TOWERS.find(t => t.id === id && t.isActive);

    if (!tower) {
      return of(buildErrorResponse(
        `/api/towers/${id}`,
        404,
        `Tower with id ${id} not found`
      ));
    }

    // Validate coordinates if provided
    if (request.latitude !== undefined && (request.latitude < -90 || request.latitude > 90)) {
      return of(buildErrorResponse(
        `/api/towers/${id}`,
        400,
        'Invalid latitude: must be between -90 and 90'
      ));
    }

    if (request.longitude !== undefined && (request.longitude < -180 || request.longitude > 180)) {
      return of(buildErrorResponse(
        `/api/towers/${id}`,
        400,
        'Invalid longitude: must be between -180 and 180'
      ));
    }

    // Validate status if provided
    if (request.status && !Object.values(Status).includes(request.status as Status)) {
      return of(buildErrorResponse(
        `/api/towers/${id}`,
        400,
        `Invalid status value. Must be one of: ${Object.values(Status).join(', ')}`
      ));
    }

    // Create updated tower with new timestamp
    const updatedTower: Tower = {
      ...tower,
      name: request.name !== undefined ? request.name : tower.name,
      address: request.address !== undefined ? request.address : tower.address,
      latitude: request.latitude !== undefined ? request.latitude : tower.latitude,
      longitude: request.longitude !== undefined ? request.longitude : tower.longitude,
      status: request.status !== undefined ? request.status as Status : tower.status,
      updatedAt: generateTimestamp()
    };

    return of(buildApiResponse(
      updatedTower,
      `/api/towers/${id}`,
      200,
      'Tower updated successfully'
    ));
  }

  /**
   * Delete a tower
   * 
   * Marks a tower as inactive (soft delete).
   * Returns success confirmation.
   * 
   * @param id - Tower ID
   * @returns Observable<ApiResponse<void>> with success confirmation
   */
  deleteTower(id: string): Observable<ApiResponse<void | null>> {
    // Find tower by ID
    const tower = MOCK_TOWERS.find(t => t.id === id && t.isActive);

    if (!tower) {
      return of(buildErrorResponse(
        `/api/towers/${id}`,
        404,
        `Tower with id ${id} not found`
      ));
    }

    // In a real implementation, this would mark the tower as inactive
    // For mock service, we just return success
    return of(buildApiResponse(
      undefined as void,
      `/api/towers/${id}`,
      200,
      'Tower deleted successfully'
    ));
  }
}
