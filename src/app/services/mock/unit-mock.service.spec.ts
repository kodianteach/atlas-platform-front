/**
 * Unit Tests for UnitMockService
 */

import { TestBed } from '@angular/core/testing';
import { UnitMockService } from './unit-mock.service';
import { UnitStatus } from './types/entities.interface';

describe('UnitMockService', () => {
  let service: UnitMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitMockService]
    });
    service = TestBed.inject(UnitMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUnit', () => {
    it('should create a new unit with generated ID and audit fields', (done) => {
      const request = {
        number: '101',
        towerId: 'tower-1',
        floor: 1,
        area: 850
      };

      service.createUnit(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(201);
        expect(response.data!.id).toBeTruthy();
        expect(response.data!.status).toBe(UnitStatus.AVAILABLE);
        expect(response.data!.towerId).toBe(request.towerId);
        done();
      });
    });

    it('should return 400 when required fields are missing', (done) => {
      const request = { number: '', towerId: '', floor: 0, area: 0 };
      service.createUnit(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        done();
      });
    });
  });

  describe('getUnit', () => {
    it('should return unit by ID with tower association', (done) => {
      service.getUnit('unit-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data!.towerId).toBeTruthy();
        expect(response.data!.occupantId).toBeDefined();
        done();
      });
    });

    it('should return 404 when unit not found', (done) => {
      service.getUnit('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        done();
      });
    });
  });

  describe('listUnits', () => {
    it('should return array of units with occupancy information', (done) => {
      service.listUnits().subscribe(response => {
        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
        response.data.forEach(unit => {
          expect(unit.status).toBeDefined();
          expect(unit.towerId).toBeTruthy();
        });
        done();
      });
    });

    it('should filter units by towerId', (done) => {
      service.listUnits({ filter: { towerId: 'tower-1' } }).subscribe(response => {
        expect(response.data.every(u => u.towerId === 'tower-1')).toBe(true);
        done();
      });
    });

    it('should filter units by status', (done) => {
      service.listUnits({ filter: { status: UnitStatus.AVAILABLE } }).subscribe(response => {
        expect(response.data.every(u => u.status === UnitStatus.AVAILABLE)).toBe(true);
        done();
      });
    });
  });

  describe('updateUnit', () => {
    it('should update unit status', (done) => {
      service.updateUnit('unit-1', { status: UnitStatus.MAINTENANCE }).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data!.status).toBe(UnitStatus.MAINTENANCE);
        done();
      });
    });

    it('should return 400 when status is invalid', (done) => {
      service.updateUnit('unit-1', { status: 'INVALID' }).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        done();
      });
    });
  });

  describe('deleteUnit', () => {
    it('should delete unit successfully', (done) => {
      service.deleteUnit('unit-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        done();
      });
    });
  });
});
