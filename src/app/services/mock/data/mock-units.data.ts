/**
 * Mock Unit Data
 * Sample units with tower references and varied statuses for testing
 */

import { Unit, UnitStatus } from '../types/entities.interface';

export const MOCK_UNITS: Unit[] = [
  // North Tower (tower-1) units
  {
    id: 'unit-1',
    number: '101',
    towerId: 'tower-1',
    floor: 1,
    status: UnitStatus.OCCUPIED,
    area: 850,
    occupantId: 'user-3',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-2',
    number: '102',
    towerId: 'tower-1',
    floor: 1,
    status: UnitStatus.AVAILABLE,
    area: 920,
    occupantId: undefined,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-3',
    number: '201',
    towerId: 'tower-1',
    floor: 2,
    status: UnitStatus.OCCUPIED,
    area: 850,
    occupantId: 'user-7',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-4',
    number: '202',
    towerId: 'tower-1',
    floor: 2,
    status: UnitStatus.MAINTENANCE,
    area: 920,
    occupantId: undefined,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-5',
    number: '301',
    towerId: 'tower-1',
    floor: 3,
    status: UnitStatus.AVAILABLE,
    area: 1100,
    occupantId: undefined,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  // South Tower (tower-2) units
  {
    id: 'unit-6',
    number: '101',
    towerId: 'tower-2',
    floor: 1,
    status: UnitStatus.OCCUPIED,
    area: 780,
    occupantId: 'user-8',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-7',
    number: '102',
    towerId: 'tower-2',
    floor: 1,
    status: UnitStatus.OCCUPIED,
    area: 780,
    occupantId: 'user-1',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-8',
    number: '201',
    towerId: 'tower-2',
    floor: 2,
    status: UnitStatus.AVAILABLE,
    area: 850,
    occupantId: undefined,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    isActive: true
  },
  // Green Valley Residence A (tower-3) units
  {
    id: 'unit-9',
    number: 'A-101',
    towerId: 'tower-3',
    floor: 1,
    status: UnitStatus.OCCUPIED,
    area: 950,
    occupantId: 'user-2',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-10',
    number: 'A-102',
    towerId: 'tower-3',
    floor: 1,
    status: UnitStatus.AVAILABLE,
    area: 920,
    occupantId: undefined,
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-11',
    number: 'A-201',
    towerId: 'tower-3',
    floor: 2,
    status: UnitStatus.OCCUPIED,
    area: 1050,
    occupantId: 'user-5',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  // Green Valley Residence B (tower-4) units
  {
    id: 'unit-12',
    number: 'B-101',
    towerId: 'tower-4',
    floor: 1,
    status: UnitStatus.MAINTENANCE,
    area: 880,
    occupantId: undefined,
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-03-08T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-13',
    number: 'B-102',
    towerId: 'tower-4',
    floor: 1,
    status: UnitStatus.AVAILABLE,
    area: 880,
    occupantId: undefined,
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  // Harbor View Tower (tower-5) units
  {
    id: 'unit-14',
    number: '1001',
    towerId: 'tower-5',
    floor: 10,
    status: UnitStatus.OCCUPIED,
    area: 1200,
    occupantId: 'user-4',
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-15',
    number: '1002',
    towerId: 'tower-5',
    floor: 10,
    status: UnitStatus.AVAILABLE,
    area: 1150,
    occupantId: undefined,
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-16',
    number: '1101',
    towerId: 'tower-5',
    floor: 11,
    status: UnitStatus.OCCUPIED,
    area: 1300,
    occupantId: 'user-6',
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    isActive: true
  },
  // Skyline Heights (tower-6) units - pending tower
  {
    id: 'unit-17',
    number: '101',
    towerId: 'tower-6',
    floor: 1,
    status: UnitStatus.AVAILABLE,
    area: 900,
    occupantId: undefined,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-18',
    number: '102',
    towerId: 'tower-6',
    floor: 1,
    status: UnitStatus.AVAILABLE,
    area: 900,
    occupantId: undefined,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    isActive: true
  },
  // Coastal Breeze (tower-7) units
  {
    id: 'unit-19',
    number: '501',
    towerId: 'tower-7',
    floor: 5,
    status: UnitStatus.OCCUPIED,
    area: 1400,
    occupantId: 'user-3',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-20',
    number: '502',
    towerId: 'tower-7',
    floor: 5,
    status: UnitStatus.AVAILABLE,
    area: 1350,
    occupantId: undefined,
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    isActive: true
  },
  // Metro Central (tower-8) units - inactive tower
  {
    id: 'unit-21',
    number: '301',
    towerId: 'tower-8',
    floor: 3,
    status: UnitStatus.MAINTENANCE,
    area: 800,
    occupantId: undefined,
    createdAt: '2022-08-15T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
    isActive: false
  },
  {
    id: 'unit-22',
    number: '302',
    towerId: 'tower-8',
    floor: 3,
    status: UnitStatus.MAINTENANCE,
    area: 800,
    occupantId: undefined,
    createdAt: '2022-08-15T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
    isActive: false
  },
  // Summit Peak (tower-9) units
  {
    id: 'unit-23',
    number: '701',
    towerId: 'tower-9',
    floor: 7,
    status: UnitStatus.OCCUPIED,
    area: 1100,
    occupantId: 'user-7',
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-24',
    number: '702',
    towerId: 'tower-9',
    floor: 7,
    status: UnitStatus.AVAILABLE,
    area: 1050,
    occupantId: undefined,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    isActive: true
  },
  {
    id: 'unit-25',
    number: '801',
    towerId: 'tower-9',
    floor: 8,
    status: UnitStatus.OCCUPIED,
    area: 1200,
    occupantId: 'user-2',
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    isActive: true
  }
];
