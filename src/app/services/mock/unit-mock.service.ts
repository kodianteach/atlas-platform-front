/**
 * Unit Mock Service
 * 
 * Provides mock implementations for UNIT module endpoints including
 * CRUD operations for units with tower association and occupancy management.
 * 
 * All methods return Observable<ApiResponse<T>> to match real HTTP service patterns.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { Unit, UnitStatus } from './types/entities.interface';
import { CreateUnitRequest, UpdateUnitRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_UNITS } from './data/mock-units.data';

@Injectable({ providedIn: 'root' })
export class UnitMockService {

  createUnit(
    request: CreateUnitRequest,
    headers?: { 'X-User-Id'?: string }
  ): Observable<ApiResponse<Unit | null>> {
    if (!request.number || !request.towerId || request.floor === undefined || request.area === undefined) {
      return of(buildErrorResponse(
        '/api/units',
        400,
        'Missing required fields: number, towerId, floor, and area are required'
      ));
    }

    const now = generateTimestamp();
    const newUnit: Unit = {
      id: generateId(),
      number: request.number,
      towerId: request.towerId,
      floor: request.floor,
      status: UnitStatus.AVAILABLE,
      area: request.area,
      occupantId: undefined,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    return of(buildApiResponse(newUnit, '/api/units', 201, 'Unit created successfully'));
  }

  getUnit(id: string): Observable<ApiResponse<Unit | null>> {
    const unit = MOCK_UNITS.find(u => u.id === id && u.isActive);

    if (!unit) {
      return of(buildErrorResponse(`/api/units/${id}`, 404, `Unit with id ${id} not found`));
    }

    return of(buildApiResponse(unit, `/api/units/${id}`, 200, 'Unit retrieved successfully'));
  }

  listUnits(
    params?: { filter?: { towerId?: string; status?: UnitStatus } }
  ): Observable<ApiResponse<Unit[]>> {
    let units = MOCK_UNITS.filter(u => u.isActive);

    if (params?.filter) {
      if (params.filter.towerId) {
        units = units.filter(u => u.towerId === params.filter!.towerId);
      }
      if (params.filter.status) {
        units = units.filter(u => u.status === params.filter!.status);
      }
    }

    return of(buildApiResponse(units, '/api/units', 200, 'Units retrieved successfully'));
  }

  updateUnit(
    id: string,
    request: UpdateUnitRequest
  ): Observable<ApiResponse<Unit | null>> {
    const unit = MOCK_UNITS.find(u => u.id === id && u.isActive);

    if (!unit) {
      return of(buildErrorResponse(`/api/units/${id}`, 404, `Unit with id ${id} not found`));
    }

    if (request.status && !Object.values(UnitStatus).includes(request.status as UnitStatus)) {
      return of(buildErrorResponse(
        `/api/units/${id}`,
        400,
        `Invalid status value. Must be one of: ${Object.values(UnitStatus).join(', ')}`
      ));
    }

    const updatedUnit: Unit = {
      ...unit,
      number: request.number !== undefined ? request.number : unit.number,
      floor: request.floor !== undefined ? request.floor : unit.floor,
      area: request.area !== undefined ? request.area : unit.area,
      status: request.status !== undefined ? request.status as UnitStatus : unit.status,
      occupantId: request.occupantId !== undefined ? request.occupantId : unit.occupantId,
      updatedAt: generateTimestamp()
    };

    return of(buildApiResponse(updatedUnit, `/api/units/${id}`, 200, 'Unit updated successfully'));
  }

  deleteUnit(id: string): Observable<ApiResponse<void | null>> {
    const unit = MOCK_UNITS.find(u => u.id === id && u.isActive);

    if (!unit) {
      return of(buildErrorResponse(`/api/units/${id}`, 404, `Unit with id ${id} not found`));
    }

    return of(buildApiResponse(undefined as void, `/api/units/${id}`, 200, 'Unit deleted successfully'));
  }
}
