/**
 * Mock Organization Data
 * Sample organizations with parent-child relationships for testing
 */

import { Organization } from '../types/entities.interface';

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Atlas Corporate',
    description: 'Main corporate organization managing multiple properties',
    parentOrganizationId: undefined,
    companyId: 'company-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'org-2',
    name: 'Atlas Residential Division',
    description: 'Residential property management division',
    parentOrganizationId: 'org-1',
    companyId: 'company-1',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    isActive: true
  },
  {
    id: 'org-3',
    name: 'Atlas Commercial Division',
    description: 'Commercial property management division',
    parentOrganizationId: 'org-1',
    companyId: 'company-1',
    createdAt: '2024-01-05T10:30:00Z',
    updatedAt: '2024-01-05T10:30:00Z',
    isActive: true
  },
  {
    id: 'org-4',
    name: 'Sunset Towers Complex',
    description: 'Luxury residential complex in downtown',
    parentOrganizationId: 'org-2',
    companyId: 'company-1',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z',
    isActive: true
  },
  {
    id: 'org-5',
    name: 'Riverside Apartments',
    description: 'Mid-range apartment complex near the river',
    parentOrganizationId: 'org-2',
    companyId: 'company-1',
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    isActive: true
  },
  {
    id: 'org-6',
    name: 'Tech Park Plaza',
    description: 'Modern office complex in tech district',
    parentOrganizationId: 'org-3',
    companyId: 'company-1',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    isActive: true
  },
  {
    id: 'org-7',
    name: 'Green Valley Properties',
    description: 'Independent property management company',
    parentOrganizationId: undefined,
    companyId: 'company-2',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
    isActive: true
  },
  {
    id: 'org-8',
    name: 'Mountain View Condos',
    description: 'Condominium association in suburban area',
    parentOrganizationId: 'org-7',
    companyId: 'company-2',
    createdAt: '2024-02-05T13:00:00Z',
    updatedAt: '2024-02-05T13:00:00Z',
    isActive: true
  },
  {
    id: 'org-9',
    name: 'Harbor District Management',
    description: 'Mixed-use development near the harbor',
    parentOrganizationId: undefined,
    companyId: 'company-3',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
    isActive: true
  },
  {
    id: 'org-10',
    name: 'Legacy Towers - Inactive',
    description: 'Former property complex, now inactive',
    parentOrganizationId: 'org-1',
    companyId: 'company-1',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-03-01T15:00:00Z',
    isActive: false
  }
];
