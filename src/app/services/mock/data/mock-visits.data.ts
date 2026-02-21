/**
 * Mock Visit Data
 * Sample visit requests with varied statuses for testing
 */

import { Visit, VisitStatus } from '../types/entities.interface';

export const MOCK_VISITS: Visit[] = [
  {
    id: 'visit-1',
    visitorName: 'John Smith',
    visitorDocument: 'ID-12345678',
    unitId: 'unit-1',
    requestedBy: 'user-3',
    scheduledDate: '2024-02-15T14:00:00Z',
    status: VisitStatus.APPROVED,
    approvedBy: 'user-1',
    approvedAt: '2024-02-14T10:00:00Z',
    createdAt: '2024-02-14T09:00:00Z',
    updatedAt: '2024-02-14T10:00:00Z',
    isActive: true
  },
  {
    id: 'visit-2',
    visitorName: 'Maria Garcia',
    visitorDocument: 'PASS-87654321',
    unitId: 'unit-3',
    requestedBy: 'user-7',
    scheduledDate: '2024-02-16T10:30:00Z',
    status: VisitStatus.PENDING,
    approvedBy: undefined,
    approvedAt: undefined,
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-02-15T08:00:00Z',
    isActive: true
  },
  {
    id: 'visit-3',
    visitorName: 'Robert Johnson',
    visitorDocument: 'DL-11223344',
    unitId: 'unit-6',
    requestedBy: 'user-8',
    scheduledDate: '2024-02-14T16:00:00Z',
    status: VisitStatus.COMPLETED,
    approvedBy: 'user-1',
    approvedAt: '2024-02-13T15:00:00Z',
    createdAt: '2024-02-13T14:00:00Z',
    updatedAt: '2024-02-14T17:00:00Z',
    isActive: true
  },
  {
    id: 'visit-4',
    visitorName: 'Lisa Chen',
    visitorDocument: 'ID-99887766',
    unitId: 'unit-9',
    requestedBy: 'user-2',
    scheduledDate: '2024-02-17T11:00:00Z',
    status: VisitStatus.REJECTED,
    approvedBy: 'user-1',
    approvedAt: '2024-02-15T09:00:00Z',
    createdAt: '2024-02-15T08:30:00Z',
    updatedAt: '2024-02-15T09:00:00Z',
    isActive: true
  },
  {
    id: 'visit-5',
    visitorName: 'David Brown',
    visitorDocument: 'PASS-55443322',
    unitId: 'unit-14',
    requestedBy: 'user-4',
    scheduledDate: '2024-02-18T15:30:00Z',
    status: VisitStatus.PENDING,
    approvedBy: undefined,
    approvedAt: undefined,
    createdAt: '2024-02-16T10:00:00Z',
    updatedAt: '2024-02-16T10:00:00Z',
    isActive: true
  }
];
