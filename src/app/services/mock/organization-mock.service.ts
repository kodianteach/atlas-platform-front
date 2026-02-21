/**
 * Organization Mock Service
 * 
 * Provides mock implementations for ORGANIZATION module endpoints including
 * CRUD operations for organizations with hierarchy support and metadata.
 * 
 * All methods return Observable<ApiResponse<T>> to match real HTTP service patterns.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { Organization } from './types/entities.interface';
import { CreateOrganizationRequest, UpdateOrganizationRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_ORGANIZATIONS } from './data/mock-organizations.data';

@Injectable({ providedIn: 'root' })
export class OrganizationMockService {

  /**
   * Create a new organization
   * 
   * Creates a new organization with generated ID and audit fields.
   * Supports parent-child relationships via parentOrganizationId.
   * 
   * @param request - Organization creation details (name, description, companyId, parentOrganizationId)
   * @param headers - Optional request headers
   * @returns Observable<ApiResponse<Organization>> with created organization
   */
  createOrganization(
    request: CreateOrganizationRequest,
    headers?: { 'X-User-Id'?: string }
  ): Observable<ApiResponse<Organization | null>> {
    // Validate required fields
    if (!request.name || !request.description || !request.companyId) {
      return of(buildErrorResponse(
        '/api/organizations',
        400,
        'Missing required fields: name, description, and companyId are required'
      ));
    }

    // Validate parent organization exists if provided
    if (request.parentOrganizationId) {
      const parentExists = MOCK_ORGANIZATIONS.find(
        o => o.id === request.parentOrganizationId && o.isActive
      );
      if (!parentExists) {
        return of(buildErrorResponse(
          '/api/organizations',
          400,
          `Parent organization with id ${request.parentOrganizationId} not found`
        ));
      }
    }

    // Create new organization with generated ID and audit fields
    const now = generateTimestamp();
    const newOrganization: Organization = {
      id: generateId(),
      name: request.name,
      description: request.description,
      parentOrganizationId: request.parentOrganizationId,
      companyId: request.companyId,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    return of(buildApiResponse(
      newOrganization,
      '/api/organizations',
      201,
      'Organization created successfully'
    ));
  }

  /**
   * Get a single organization by ID
   * 
   * Retrieves complete organization data with metadata.
   * Returns 404 if organization not found.
   * 
   * @param id - Organization ID
   * @returns Observable<ApiResponse<Organization>> with organization data
   */
  getOrganization(id: string): Observable<ApiResponse<Organization | null>> {
    // Find organization by ID
    const organization = MOCK_ORGANIZATIONS.find(o => o.id === id && o.isActive);

    if (!organization) {
      return of(buildErrorResponse(
        `/api/organizations/${id}`,
        404,
        `Organization with id ${id} not found`
      ));
    }

    return of(buildApiResponse(
      organization,
      `/api/organizations/${id}`,
      200,
      'Organization retrieved successfully'
    ));
  }

  /**
   * List all organizations
   * 
   * Returns array of all active organizations.
   * Supports filtering by companyId and parentOrganizationId.
   * 
   * @param params - Optional query parameters for filtering
   * @returns Observable<ApiResponse<Organization[]>> with array of organizations
   */
  listOrganizations(
    params?: { filter?: { companyId?: string; parentOrganizationId?: string } }
  ): Observable<ApiResponse<Organization[]>> {
    // Start with active organizations
    let organizations = MOCK_ORGANIZATIONS.filter(o => o.isActive);

    // Apply filtering if provided
    if (params?.filter) {
      if (params.filter.companyId) {
        organizations = organizations.filter(o => o.companyId === params.filter!.companyId);
      }
      if (params.filter.parentOrganizationId !== undefined) {
        organizations = organizations.filter(
          o => o.parentOrganizationId === params.filter!.parentOrganizationId
        );
      }
    }

    return of(buildApiResponse(
      organizations,
      '/api/organizations',
      200,
      'Organizations retrieved successfully'
    ));
  }

  /**
   * Get organization hierarchy
   * 
   * Returns parent-child relationships for organizations.
   * Includes all descendants of the specified organization.
   * 
   * @param id - Root organization ID
   * @returns Observable<ApiResponse<Organization[]>> with hierarchical organization data
   */
  getOrganizationHierarchy(id: string): Observable<ApiResponse<Organization[] | null>> {
    // Find root organization
    const rootOrg = MOCK_ORGANIZATIONS.find(o => o.id === id && o.isActive);

    if (!rootOrg) {
      return of(buildErrorResponse(
        `/api/organizations/${id}/hierarchy`,
        404,
        `Organization with id ${id} not found`
      ));
    }

    // Build hierarchy by finding all descendants
    const hierarchy: Organization[] = [rootOrg];
    const findChildren = (parentId: string) => {
      const children = MOCK_ORGANIZATIONS.filter(
        o => o.parentOrganizationId === parentId && o.isActive
      );
      children.forEach(child => {
        hierarchy.push(child);
        findChildren(child.id);
      });
    };

    findChildren(id);

    return of(buildApiResponse(
      hierarchy,
      `/api/organizations/${id}/hierarchy`,
      200,
      'Organization hierarchy retrieved successfully'
    ));
  }

  /**
   * Update an existing organization
   * 
   * Updates organization fields and refreshes updatedAt timestamp.
   * Returns 404 if organization not found.
   * 
   * @param id - Organization ID
   * @param request - Update details (name, description, parentOrganizationId)
   * @returns Observable<ApiResponse<Organization>> with updated organization
   */
  updateOrganization(
    id: string,
    request: UpdateOrganizationRequest
  ): Observable<ApiResponse<Organization | null>> {
    // Find organization by ID
    const organization = MOCK_ORGANIZATIONS.find(o => o.id === id && o.isActive);

    if (!organization) {
      return of(buildErrorResponse(
        `/api/organizations/${id}`,
        404,
        `Organization with id ${id} not found`
      ));
    }

    // Validate parent organization exists if provided
    if (request.parentOrganizationId !== undefined && request.parentOrganizationId !== null) {
      const parentExists = MOCK_ORGANIZATIONS.find(
        o => o.id === request.parentOrganizationId && o.isActive
      );
      if (!parentExists) {
        return of(buildErrorResponse(
          `/api/organizations/${id}`,
          400,
          `Parent organization with id ${request.parentOrganizationId} not found`
        ));
      }

      // Prevent circular references
      if (request.parentOrganizationId === id) {
        return of(buildErrorResponse(
          `/api/organizations/${id}`,
          400,
          'Organization cannot be its own parent'
        ));
      }
    }

    // Create updated organization with new timestamp
    const updatedOrganization: Organization = {
      ...organization,
      name: request.name !== undefined ? request.name : organization.name,
      description: request.description !== undefined ? request.description : organization.description,
      parentOrganizationId: request.parentOrganizationId !== undefined 
        ? request.parentOrganizationId 
        : organization.parentOrganizationId,
      updatedAt: generateTimestamp()
    };

    return of(buildApiResponse(
      updatedOrganization,
      `/api/organizations/${id}`,
      200,
      'Organization updated successfully'
    ));
  }

  /**
   * Delete an organization
   * 
   * Marks an organization as inactive (soft delete).
   * Returns success confirmation.
   * 
   * @param id - Organization ID
   * @returns Observable<ApiResponse<void>> with success confirmation
   */
  deleteOrganization(id: string): Observable<ApiResponse<void | null>> {
    // Find organization by ID
    const organization = MOCK_ORGANIZATIONS.find(o => o.id === id && o.isActive);

    if (!organization) {
      return of(buildErrorResponse(
        `/api/organizations/${id}`,
        404,
        `Organization with id ${id} not found`
      ));
    }

    // Check if organization has active children
    const hasChildren = MOCK_ORGANIZATIONS.some(
      o => o.parentOrganizationId === id && o.isActive
    );

    if (hasChildren) {
      return of(buildErrorResponse(
        `/api/organizations/${id}`,
        400,
        'Cannot delete organization with active child organizations'
      ));
    }

    // In a real implementation, this would mark the organization as inactive
    // For mock service, we just return success
    return of(buildApiResponse(
      undefined as void,
      `/api/organizations/${id}`,
      200,
      'Organization deleted successfully'
    ));
  }
}
