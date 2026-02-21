/**
 * Mock Company Data
 * Sample companies with varied statuses for testing
 */

import { Company, Status } from '../types/entities.interface';

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'company-1',
    name: 'Atlas Property Management Inc.',
    taxId: '12-3456789',
    address: '100 Corporate Plaza, Suite 500, New York, NY 10001',
    status: Status.ACTIVE,
    contactEmail: 'contact@atlaspm.com',
    contactPhone: '+1-555-0100',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'company-2',
    name: 'Green Valley Real Estate LLC',
    taxId: '98-7654321',
    address: '250 Oak Street, Portland, OR 97201',
    status: Status.ACTIVE,
    contactEmail: 'info@greenvalley.com',
    contactPhone: '+1-555-0200',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'company-3',
    name: 'Harbor Development Group',
    taxId: '45-6789012',
    address: '789 Waterfront Drive, Seattle, WA 98101',
    status: Status.ACTIVE,
    contactEmail: 'contact@harbordev.com',
    contactPhone: '+1-555-0300',
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'company-4',
    name: 'Skyline Properties Corp.',
    taxId: '23-4567890',
    address: '456 High Street, Chicago, IL 60601',
    status: Status.PENDING,
    contactEmail: 'admin@skylineprops.com',
    contactPhone: '+1-555-0400',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'company-5',
    name: 'Coastal Realty Partners',
    taxId: '67-8901234',
    address: '321 Beach Boulevard, Miami, FL 33139',
    status: Status.PENDING,
    contactEmail: 'info@coastalrealty.com',
    contactPhone: '+1-555-0500',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    isActive: true
  },
  {
    id: 'company-6',
    name: 'Metro Housing Solutions',
    taxId: '34-5678901',
    address: '555 Main Avenue, Boston, MA 02101',
    status: Status.INACTIVE,
    contactEmail: 'contact@metrohousing.com',
    contactPhone: '+1-555-0600',
    createdAt: '2022-08-15T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
    isActive: false
  },
  {
    id: 'company-7',
    name: 'Summit Property Group',
    taxId: '56-7890123',
    address: '888 Mountain Road, Denver, CO 80202',
    status: Status.ACTIVE,
    contactEmail: 'hello@summitpg.com',
    contactPhone: '+1-555-0700',
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    isActive: true
  },
  {
    id: 'company-8',
    name: 'Urban Living Enterprises',
    taxId: '78-9012345',
    address: '999 City Center, Austin, TX 78701',
    status: Status.INACTIVE,
    contactEmail: 'support@urbanliving.com',
    contactPhone: '+1-555-0800',
    createdAt: '2022-05-10T00:00:00Z',
    updatedAt: '2023-11-15T00:00:00Z',
    isActive: false
  },
  {
    id: 'company-9',
    name: 'Prestige Residential Management',
    taxId: '89-0123456',
    address: '123 Luxury Lane, Los Angeles, CA 90001',
    status: Status.ACTIVE,
    contactEmail: 'contact@prestigerm.com',
    contactPhone: '+1-555-0900',
    createdAt: '2023-11-05T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
    isActive: true
  },
  {
    id: 'company-10',
    name: 'Heritage Property Services',
    taxId: '90-1234567',
    address: '777 Historic District, Philadelphia, PA 19101',
    status: Status.PENDING,
    contactEmail: 'info@heritageps.com',
    contactPhone: '+1-555-1000',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    isActive: true
  }
];
