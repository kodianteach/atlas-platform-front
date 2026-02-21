/**
 * Mock Tower Data
 * Sample towers with location coordinates and varied statuses for testing
 */

import { Tower, Status } from '../types/entities.interface';

export const MOCK_TOWERS: Tower[] = [
  {
    id: 'tower-1',
    name: 'North Tower',
    organizationId: 'org-1',
    address: '100 Corporate Plaza, New York, NY 10001',
    latitude: 40.7589,
    longitude: -73.9851,
    status: Status.ACTIVE,
    unitCount: 120,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'tower-2',
    name: 'South Tower',
    organizationId: 'org-1',
    address: '102 Corporate Plaza, New York, NY 10001',
    latitude: 40.7585,
    longitude: -73.9855,
    status: Status.ACTIVE,
    unitCount: 100,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'tower-3',
    name: 'Green Valley Residence A',
    organizationId: 'org-2',
    address: '250 Oak Street, Portland, OR 97201',
    latitude: 45.5152,
    longitude: -122.6784,
    status: Status.ACTIVE,
    unitCount: 80,
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'tower-4',
    name: 'Green Valley Residence B',
    organizationId: 'org-2',
    address: '252 Oak Street, Portland, OR 97201',
    latitude: 45.5148,
    longitude: -122.6788,
    status: Status.ACTIVE,
    unitCount: 75,
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'tower-5',
    name: 'Harbor View Tower',
    organizationId: 'org-3',
    address: '789 Waterfront Drive, Seattle, WA 98101',
    latitude: 47.6062,
    longitude: -122.3321,
    status: Status.ACTIVE,
    unitCount: 150,
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'tower-6',
    name: 'Skyline Heights',
    organizationId: 'org-1',
    address: '456 High Street, Chicago, IL 60601',
    latitude: 41.8781,
    longitude: -87.6298,
    status: Status.PENDING,
    unitCount: 200,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'tower-7',
    name: 'Coastal Breeze',
    organizationId: 'org-2',
    address: '321 Beach Boulevard, Miami, FL 33139',
    latitude: 25.7907,
    longitude: -80.1300,
    status: Status.ACTIVE,
    unitCount: 90,
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    isActive: true
  },
  {
    id: 'tower-8',
    name: 'Metro Central',
    organizationId: 'org-3',
    address: '555 Main Avenue, Boston, MA 02101',
    latitude: 42.3601,
    longitude: -71.0589,
    status: Status.INACTIVE,
    unitCount: 110,
    createdAt: '2022-08-15T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
    isActive: false
  },
  {
    id: 'tower-9',
    name: 'Summit Peak',
    organizationId: 'org-1',
    address: '888 Mountain Road, Denver, CO 80202',
    latitude: 39.7392,
    longitude: -104.9903,
    status: Status.ACTIVE,
    unitCount: 85,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    isActive: true
  },
  {
    id: 'tower-10',
    name: 'Urban Loft Complex',
    organizationId: 'org-2',
    address: '999 City Center, Austin, TX 78701',
    latitude: 30.2672,
    longitude: -97.7431,
    status: Status.INACTIVE,
    unitCount: 65,
    createdAt: '2022-05-10T00:00:00Z',
    updatedAt: '2023-11-15T00:00:00Z',
    isActive: false
  }
];
