/**
 * Mock Poll Data
 * Sample polls with options and vote counts for testing
 */

import { Poll } from '../types/entities.interface';

export const MOCK_POLLS: Poll[] = [
  {
    id: 'poll-1',
    question: 'Should we install a new gym in the building?',
    organizationId: 'org-1',
    createdBy: 'user-1',
    expiresAt: '2024-03-31T23:59:59Z',
    options: [
      { id: 'opt-1', text: 'Yes, definitely', voteCount: 45 },
      { id: 'opt-2', text: 'No, not needed', voteCount: 12 },
      { id: 'opt-3', text: 'Maybe later', voteCount: 23 }
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z',
    isActive: true
  },
  {
    id: 'poll-2',
    question: 'Preferred time for building maintenance?',
    organizationId: 'org-1',
    createdBy: 'user-1',
    expiresAt: '2024-02-28T23:59:59Z',
    options: [
      { id: 'opt-4', text: 'Weekday mornings', voteCount: 18 },
      { id: 'opt-5', text: 'Weekday afternoons', voteCount: 34 },
      { id: 'opt-6', text: 'Weekends', voteCount: 28 }
    ],
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-16T11:00:00Z',
    isActive: true
  },
  {
    id: 'poll-3',
    question: 'Should we allow pets in common areas?',
    organizationId: 'org-2',
    createdBy: 'user-2',
    expiresAt: '2024-03-15T23:59:59Z',
    options: [
      { id: 'opt-7', text: 'Yes, all pets', voteCount: 22 },
      { id: 'opt-8', text: 'Only small pets', voteCount: 31 },
      { id: 'opt-9', text: 'No pets', voteCount: 15 }
    ],
    createdAt: '2024-02-05T14:00:00Z',
    updatedAt: '2024-02-16T10:00:00Z',
    isActive: true
  }
];
