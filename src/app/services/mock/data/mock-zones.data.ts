/**
 * Mock Zone Data
 * Sample zones with boundaries and varied types for testing
 */

import { Zone } from '../types/entities.interface';

export const MOCK_ZONES: Zone[] = [
  {
    id: 'zone-1',
    name: 'Main Lobby',
    organizationId: 'org-1',
    type: 'common',
    description: 'Primary entrance and reception area',
    boundaries: '{"type":"Polygon","coordinates":[[[-73.9851,40.7589],[-73.9850,40.7589],[-73.9850,40.7588],[-73.9851,40.7588],[-73.9851,40.7589]]]}',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-2',
    name: 'Parking Garage Level 1',
    organizationId: 'org-1',
    type: 'parking',
    description: 'Underground parking level 1 with 50 spaces',
    boundaries: '{"type":"Polygon","coordinates":[[[-73.9852,40.7589],[-73.9851,40.7589],[-73.9851,40.7587],[-73.9852,40.7587],[-73.9852,40.7589]]]}',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-3',
    name: 'Rooftop Garden',
    organizationId: 'org-1',
    type: 'amenity',
    description: 'Rooftop recreational area with garden and seating',
    boundaries: '{"type":"Polygon","coordinates":[[[-73.9851,40.7590],[-73.9850,40.7590],[-73.9850,40.7589],[-73.9851,40.7589],[-73.9851,40.7590]]]}',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-4',
    name: 'Fitness Center',
    organizationId: 'org-1',
    type: 'amenity',
    description: '24/7 fitness center with modern equipment',
    boundaries: '{"type":"Polygon","coordinates":[[[-73.9850,40.7589],[-73.9849,40.7589],[-73.9849,40.7588],[-73.9850,40.7588],[-73.9850,40.7589]]]}',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-5',
    name: 'Pool Area',
    organizationId: 'org-2',
    type: 'amenity',
    description: 'Outdoor pool with lounge chairs and cabanas',
    boundaries: '{"type":"Polygon","coordinates":[[[-122.6784,45.5152],[-122.6783,45.5152],[-122.6783,45.5151],[-122.6784,45.5151],[-122.6784,45.5152]]]}',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-6',
    name: 'Visitor Parking',
    organizationId: 'org-2',
    type: 'parking',
    description: 'Surface parking for visitors and guests',
    boundaries: '{"type":"Polygon","coordinates":[[[-122.6785,45.5152],[-122.6784,45.5152],[-122.6784,45.5150],[-122.6785,45.5150],[-122.6785,45.5152]]]}',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-7',
    name: 'Community Room',
    organizationId: 'org-2',
    type: 'common',
    description: 'Multi-purpose room for events and gatherings',
    boundaries: '{"type":"Polygon","coordinates":[[[-122.6784,45.5153],[-122.6783,45.5153],[-122.6783,45.5152],[-122.6784,45.5152],[-122.6784,45.5153]]]}',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-8',
    name: 'Security Office',
    organizationId: 'org-3',
    type: 'restricted',
    description: 'Security personnel office and monitoring station',
    boundaries: '{"type":"Polygon","coordinates":[[[-122.3321,47.6062],[-122.3320,47.6062],[-122.3320,47.6061],[-122.3321,47.6061],[-122.3321,47.6062]]]}',
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-9',
    name: 'Loading Dock',
    organizationId: 'org-3',
    type: 'service',
    description: 'Service entrance for deliveries and maintenance',
    boundaries: '{"type":"Polygon","coordinates":[[[-122.3322,47.6062],[-122.3321,47.6062],[-122.3321,47.6060],[-122.3322,47.6060],[-122.3322,47.6062]]]}',
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-10',
    name: 'Business Center',
    organizationId: 'org-1',
    type: 'amenity',
    description: 'Co-working space with meeting rooms and printers',
    boundaries: '{"type":"Polygon","coordinates":[[[-73.9849,40.7589],[-73.9848,40.7589],[-73.9848,40.7588],[-73.9849,40.7588],[-73.9849,40.7589]]]}',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-11',
    name: 'Children Playground',
    organizationId: 'org-2',
    type: 'amenity',
    description: 'Outdoor playground with safety equipment',
    boundaries: '{"type":"Polygon","coordinates":[[[-122.6783,45.5151],[-122.6782,45.5151],[-122.6782,45.5150],[-122.6783,45.5150],[-122.6783,45.5151]]]}',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-12',
    name: 'Maintenance Workshop',
    organizationId: 'org-1',
    type: 'service',
    description: 'Maintenance staff workshop and storage',
    boundaries: '{"type":"Polygon","coordinates":[[[-73.9852,40.7587],[-73.9851,40.7587],[-73.9851,40.7586],[-73.9852,40.7586],[-73.9852,40.7587]]]}',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-13',
    name: 'Package Room',
    organizationId: 'org-3',
    type: 'service',
    description: 'Secure package storage and pickup area',
    boundaries: '{"type":"Polygon","coordinates":[[[-122.3320,47.6062],[-122.3319,47.6062],[-122.3319,47.6061],[-122.3320,47.6061],[-122.3320,47.6062]]]}',
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-14',
    name: 'Pet Spa',
    organizationId: 'org-2',
    type: 'amenity',
    description: 'Pet grooming and washing station',
    boundaries: '{"type":"Polygon","coordinates":[[[-122.6782,45.5152],[-122.6781,45.5152],[-122.6781,45.5151],[-122.6782,45.5151],[-122.6782,45.5152]]]}',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'zone-15',
    name: 'Emergency Exit Corridor',
    organizationId: 'org-1',
    type: 'restricted',
    description: 'Fire exit and emergency evacuation route',
    boundaries: '{"type":"Polygon","coordinates":[[[-73.9851,40.7588],[-73.9850,40.7588],[-73.9850,40.7587],[-73.9851,40.7587],[-73.9851,40.7588]]]}',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  }
];
