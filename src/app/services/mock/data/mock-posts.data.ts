/**
 * Mock Post Data
 * Sample posts with varied content referencing mock users
 */

import { Post } from '../types/entities.interface';

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Welcome to Atlas Platform',
    content: 'We are excited to announce the launch of our new community platform. This will be your central hub for all community updates, announcements, and discussions.',
    authorId: 'user-1',
    organizationId: 'org-1',
    commentCount: 3,
    likeCount: 15,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    isActive: true
  },
  {
    id: 'post-2',
    title: 'Maintenance Schedule for March',
    content: 'Please be advised that routine maintenance will be conducted on all elevators from March 15-17. We apologize for any inconvenience.',
    authorId: 'user-2',
    organizationId: 'org-2',
    commentCount: 5,
    likeCount: 8,
    createdAt: '2024-03-01T09:30:00Z',
    updatedAt: '2024-03-01T09:30:00Z',
    isActive: true
  },
  {
    id: 'post-3',
    title: 'Community Event: Spring BBQ',
    content: 'Join us for our annual Spring BBQ on April 20th at the community garden. Food, drinks, and entertainment provided. RSVP by April 15th.',
    authorId: 'user-3',
    organizationId: 'org-1',
    commentCount: 12,
    likeCount: 42,
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
    isActive: true
  },
  {
    id: 'post-4',
    title: 'Security Update: New Access System',
    content: 'We have upgraded our access control system. All residents will receive new access cards by the end of the week. Please contact security if you have any questions.',
    authorId: 'user-4',
    organizationId: 'org-3',
    commentCount: 7,
    likeCount: 20,
    createdAt: '2024-02-10T11:15:00Z',
    updatedAt: '2024-02-10T11:15:00Z',
    isActive: true
  },
  {
    id: 'post-5',
    title: 'Parking Lot Resurfacing',
    content: 'The parking lot will be resurfaced next week. Please move your vehicles to the temporary parking area by Monday morning.',
    authorId: 'user-5',
    organizationId: 'org-2',
    commentCount: 9,
    likeCount: 6,
    createdAt: '2024-03-08T08:45:00Z',
    updatedAt: '2024-03-08T08:45:00Z',
    isActive: true
  },
  {
    id: 'post-6',
    title: 'Lost and Found Items',
    content: 'Several items have been turned in to the front desk. Please check with reception if you are missing anything.',
    authorId: 'user-1',
    organizationId: 'org-1',
    commentCount: 2,
    likeCount: 4,
    createdAt: '2024-03-12T16:20:00Z',
    updatedAt: '2024-03-12T16:20:00Z',
    isActive: true
  },
  {
    id: 'post-7',
    title: 'Gym Equipment Upgrade',
    content: 'New cardio equipment has been installed in the fitness center. We hope you enjoy the upgraded facilities!',
    authorId: 'user-7',
    organizationId: 'org-1',
    commentCount: 8,
    likeCount: 35,
    createdAt: '2024-02-25T13:00:00Z',
    updatedAt: '2024-02-25T13:00:00Z',
    isActive: true
  },
  {
    id: 'post-8',
    title: 'Noise Complaint Reminder',
    content: 'Please be mindful of noise levels after 10 PM. We have received several complaints recently. Thank you for your cooperation.',
    authorId: 'user-2',
    organizationId: 'org-2',
    commentCount: 15,
    likeCount: 11,
    createdAt: '2024-03-05T17:30:00Z',
    updatedAt: '2024-03-05T17:30:00Z',
    isActive: true
  },
  {
    id: 'post-9',
    title: 'Pool Opening Date Announced',
    content: 'The community pool will open for the season on May 1st. Pool hours will be 6 AM to 10 PM daily.',
    authorId: 'user-3',
    organizationId: 'org-1',
    commentCount: 6,
    likeCount: 28,
    createdAt: '2024-03-18T10:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
    isActive: true
  },
  {
    id: 'post-10',
    title: 'Package Delivery Notice',
    content: 'Due to increased package volume, please pick up your deliveries within 48 hours of notification. Unclaimed packages will be returned to sender.',
    authorId: 'user-4',
    organizationId: 'org-3',
    commentCount: 4,
    likeCount: 7,
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
    isActive: true
  },
  {
    id: 'post-11',
    title: 'Recycling Program Update',
    content: 'We are expanding our recycling program to include composting. New bins will be placed on each floor starting next month.',
    authorId: 'user-5',
    organizationId: 'org-2',
    commentCount: 10,
    likeCount: 31,
    createdAt: '2024-02-28T15:45:00Z',
    updatedAt: '2024-02-28T15:45:00Z',
    isActive: true
  },
  {
    id: 'post-12',
    title: 'Internet Outage Scheduled',
    content: 'There will be a brief internet outage on March 25th from 2-4 AM for system upgrades. We apologize for any inconvenience.',
    authorId: 'user-1',
    organizationId: 'org-1',
    commentCount: 1,
    likeCount: 3,
    createdAt: '2024-03-14T11:30:00Z',
    updatedAt: '2024-03-14T11:30:00Z',
    isActive: true
  }
];
