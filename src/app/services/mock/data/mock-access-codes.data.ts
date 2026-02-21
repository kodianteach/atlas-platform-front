/**
 * Mock Access Code Data
 * Sample access codes for QR validation testing
 */

import { AccessCode } from '../types/entities.interface';

export const MOCK_ACCESS_CODES: AccessCode[] = [
  {
    id: 'access-1',
    code: 'QR-ABC123456789',
    userId: 'user-1',
    organizationId: 'org-1',
    validFrom: '2024-02-01T00:00:00Z',
    validUntil: '2025-03-01T23:59:59Z',
    usageCount: 5,
    maxUsages: 10,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z',
    isActive: true
  },
  {
    id: 'access-2',
    code: 'QR-DEF987654321',
    userId: 'user-3',
    organizationId: 'org-1',
    validFrom: '2024-02-10T00:00:00Z',
    validUntil: '2025-04-10T23:59:59Z',
    usageCount: 2,
    maxUsages: 20,
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-14T11:00:00Z',
    isActive: true
  },
  {
    id: 'access-3',
    code: 'QR-GHI555444333',
    userId: 'user-7',
    organizationId: 'org-2',
    validFrom: '2024-01-15T00:00:00Z',
    validUntil: '2024-02-15T23:59:59Z',
    usageCount: 15,
    maxUsages: 15,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-15T23:59:59Z',
    isActive: false
  }
];
