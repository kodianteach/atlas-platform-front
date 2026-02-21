/**
 * Company Mock Service
 * 
 * Provides mock implementations for COMPANY module endpoints including
 * CRUD operations for companies with status management.
 * 
 * All methods return Observable<ApiResponse<T>> to match real HTTP service patterns.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './types/api-response.interface';
import { Company, Status } from './types/entities.interface';
import { CreateCompanyRequest, UpdateCompanyRequest } from './types/requests.interface';
import { buildApiResponse, buildErrorResponse } from './utils/response-builder';
import { generateId, generateTimestamp } from './utils/generators';
import { MOCK_COMPANIES } from './data/mock-companies.data';

@Injectable({ providedIn: 'root' })
export class CompanyMockService {

  /**
   * Create a new company
   * 
   * Creates a new company with generated ID and audit fields.
   * Sets initial status to PENDING.
   * 
   * @param request - Company creation details (name, taxId, address, contactEmail, contactPhone)
   * @param headers - Optional request headers
   * @returns Observable<ApiResponse<Company>> with created company
   */
  createCompany(
    request: CreateCompanyRequest,
    headers?: { 'X-User-Id'?: string }
  ): Observable<ApiResponse<Company | null>> {
    // Validate required fields
    if (!request.name || !request.taxId || !request.address || 
        !request.contactEmail || !request.contactPhone) {
      return of(buildErrorResponse(
        '/api/companies',
        400,
        'Missing required fields: name, taxId, address, contactEmail, and contactPhone are required'
      ));
    }

    // Create new company with generated ID and audit fields
    const now = generateTimestamp();
    const newCompany: Company = {
      id: generateId(),
      name: request.name,
      taxId: request.taxId,
      address: request.address,
      status: Status.PENDING,
      contactEmail: request.contactEmail,
      contactPhone: request.contactPhone,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };

    return of(buildApiResponse(
      newCompany,
      '/api/companies',
      201,
      'Company created successfully'
    ));
  }

  /**
   * Get a single company by ID
   * 
   * Retrieves complete company data.
   * Returns 404 if company not found.
   * 
   * @param id - Company ID
   * @returns Observable<ApiResponse<Company>> with company data
   */
  getCompany(id: string): Observable<ApiResponse<Company | null>> {
    // Find company by ID
    const company = MOCK_COMPANIES.find(c => c.id === id && c.isActive);

    if (!company) {
      return of(buildErrorResponse(
        `/api/companies/${id}`,
        404,
        `Company with id ${id} not found`
      ));
    }

    return of(buildApiResponse(
      company,
      `/api/companies/${id}`,
      200,
      'Company retrieved successfully'
    ));
  }

  /**
   * List all companies
   * 
   * Returns array of all active companies.
   * Supports filtering by status.
   * 
   * @param params - Optional query parameters for filtering
   * @returns Observable<ApiResponse<Company[]>> with array of companies
   */
  listCompanies(
    params?: { filter?: { status?: Status } }
  ): Observable<ApiResponse<Company[]>> {
    // Start with active companies
    let companies = MOCK_COMPANIES.filter(c => c.isActive);

    // Apply status filtering if provided
    if (params?.filter?.status) {
      companies = companies.filter(c => c.status === params.filter!.status);
    }

    return of(buildApiResponse(
      companies,
      '/api/companies',
      200,
      'Companies retrieved successfully'
    ));
  }

  /**
   * Update an existing company
   * 
   * Updates company fields and refreshes updatedAt timestamp.
   * Returns 404 if company not found.
   * 
   * @param id - Company ID
   * @param request - Update details (name, address, contactEmail, contactPhone, status)
   * @returns Observable<ApiResponse<Company>> with updated company
   */
  updateCompany(
    id: string,
    request: UpdateCompanyRequest
  ): Observable<ApiResponse<Company | null>> {
    // Find company by ID
    const company = MOCK_COMPANIES.find(c => c.id === id && c.isActive);

    if (!company) {
      return of(buildErrorResponse(
        `/api/companies/${id}`,
        404,
        `Company with id ${id} not found`
      ));
    }

    // Validate status if provided
    if (request.status && !Object.values(Status).includes(request.status as Status)) {
      return of(buildErrorResponse(
        `/api/companies/${id}`,
        400,
        `Invalid status value. Must be one of: ${Object.values(Status).join(', ')}`
      ));
    }

    // Create updated company with new timestamp
    const updatedCompany: Company = {
      ...company,
      name: request.name !== undefined ? request.name : company.name,
      address: request.address !== undefined ? request.address : company.address,
      contactEmail: request.contactEmail !== undefined ? request.contactEmail : company.contactEmail,
      contactPhone: request.contactPhone !== undefined ? request.contactPhone : company.contactPhone,
      status: request.status !== undefined ? request.status as Status : company.status,
      updatedAt: generateTimestamp()
    };

    return of(buildApiResponse(
      updatedCompany,
      `/api/companies/${id}`,
      200,
      'Company updated successfully'
    ));
  }

  /**
   * Delete a company
   * 
   * Marks a company as inactive (soft delete).
   * Returns success confirmation.
   * 
   * @param id - Company ID
   * @returns Observable<ApiResponse<void>> with success confirmation
   */
  deleteCompany(id: string): Observable<ApiResponse<void | null>> {
    // Find company by ID
    const company = MOCK_COMPANIES.find(c => c.id === id && c.isActive);

    if (!company) {
      return of(buildErrorResponse(
        `/api/companies/${id}`,
        404,
        `Company with id ${id} not found`
      ));
    }

    // In a real implementation, this would mark the company as inactive
    // For mock service, we just return success
    return of(buildApiResponse(
      undefined as void,
      `/api/companies/${id}`,
      200,
      'Company deleted successfully'
    ));
  }
}
