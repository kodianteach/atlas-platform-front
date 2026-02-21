/**
 * Mock User Data
 * Sample users with varied roles and organizations for testing
 */

import { User } from '../types/entities.interface';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'admin@atlas.com',
    firstName: 'Alice',
    lastName: 'Anderson',
    role: 'admin',
    organizationId: 'org-1',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    isActive: true
  },
  {
    id: 'user-2',
    email: 'bob.builder@construction.com',
    firstName: 'Bob',
    lastName: 'Builder',
    role: 'manager',
    organizationId: 'org-2',
    createdAt: '2024-02-10T10:30:00Z',
    updatedAt: '2024-02-10T10:30:00Z',
    isActive: true
  },
  {
    id: 'user-3',
    email: 'charlie.resident@example.com',
    firstName: 'Charlie',
    lastName: 'Chen',
    role: 'resident',
    organizationId: 'org-1',
    createdAt: '2024-03-05T14:20:00Z',
    updatedAt: '2024-03-05T14:20:00Z',
    isActive: true
  },
  {
    id: 'user-4',
    email: 'diana.security@atlas.com',
    firstName: 'Diana',
    lastName: 'Davis',
    role: 'security',
    organizationId: 'org-3',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
    isActive: true
  },
  {
    id: 'user-5',
    email: 'edward.operator@facilities.com',
    firstName: 'Edward',
    lastName: 'Evans',
    role: 'operator',
    organizationId: 'org-2',
    createdAt: '2024-02-28T11:45:00Z',
    updatedAt: '2024-02-28T11:45:00Z',
    isActive: true
  },
  {
    id: 'user-6',
    email: 'fiona.guest@example.com',
    firstName: 'Fiona',
    lastName: 'Foster',
    role: 'guest',
    organizationId: undefined,
    createdAt: '2024-03-12T16:00:00Z',
    updatedAt: '2024-03-12T16:00:00Z',
    isActive: true
  },
  {
    id: 'user-7',
    email: 'george.maintenance@atlas.com',
    firstName: 'George',
    lastName: 'Garcia',
    role: 'maintenance',
    organizationId: 'org-1',
    createdAt: '2024-01-25T07:30:00Z',
    updatedAt: '2024-01-25T07:30:00Z',
    isActive: true
  },
  {
    id: 'user-8',
    email: 'hannah.inactive@example.com',
    firstName: 'Hannah',
    lastName: 'Harris',
    role: 'resident',
    organizationId: 'org-3',
    createdAt: '2023-12-01T12:00:00Z',
    updatedAt: '2024-03-01T15:30:00Z',
    isActive: false
  }
];
