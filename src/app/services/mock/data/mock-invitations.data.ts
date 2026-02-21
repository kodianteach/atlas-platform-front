/**
 * Mock Invitation Data
 * Sample invitations with varied statuses for testing
 */

import { Invitation, InvitationStatus } from '../types/entities.interface';

export const MOCK_INVITATIONS: Invitation[] = [
  {
    id: 'invitation-1',
    email: 'newuser1@example.com',
    organizationId: 'org-1',
    invitedBy: 'user-1',
    code: 'INV-ABC123XYZ',
    status: InvitationStatus.PENDING,
    expiresAt: '2024-03-15T23:59:59Z',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    isActive: true
  },
  {
    id: 'invitation-2',
    email: 'newuser2@example.com',
    organizationId: 'org-2',
    invitedBy: 'user-1',
    code: 'INV-DEF456UVW',
    status: InvitationStatus.ACCEPTED,
    expiresAt: '2024-03-10T23:59:59Z',
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-02-12T09:00:00Z',
    isActive: true
  },
  {
    id: 'invitation-3',
    email: 'expired@example.com',
    organizationId: 'org-1',
    invitedBy: 'user-1',
    code: 'INV-GHI789RST',
    status: InvitationStatus.EXPIRED,
    expiresAt: '2024-01-31T23:59:59Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'invitation-4',
    email: 'pending@example.com',
    organizationId: 'org-3',
    invitedBy: 'user-2',
    code: 'INV-JKL012MNO',
    status: InvitationStatus.PENDING,
    expiresAt: '2024-03-20T23:59:59Z',
    createdAt: '2024-02-16T11:00:00Z',
    updatedAt: '2024-02-16T11:00:00Z',
    isActive: true
  }
];
