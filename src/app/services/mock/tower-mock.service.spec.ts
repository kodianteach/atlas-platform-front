/**
 * Unit Tests for TowerMockService
 */

import { TestBed } from '@angular/core/testing';
import { TowerMockService } from './tower-mock.service';
import { Status } from './types/entities.interface';

describe('TowerMockService', () => {
  let service: TowerMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TowerMockService]
    });
    service = TestBed.inject(TowerMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTower', () => {
    it('should create a new tower with generated ID and audit fields', (done) => {
      const request = {
        name: 'Test Tower',
        organizationId: 'org-1',
        address: '123 Test St',
        latitude: 40.7128,
        longitude: -74.0060
      };

      service.createTower(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(response.data!.id).toBeTruthy();
        expect(response.data!.name).toBe(request.name);
        expect(response.data!.organizationId).toBe(request.organizationId);
        expect(response.data!.address).toBe(request.address);
        expect(response.data!.latitude).toBe(request.latitude);
        expect(response.data!.longitude).toBe(request.longitude);
        expect(response.data!.status).toBe(Status.PENDING);
        expect(response.data!.unitCount).toBe(0);
        expect(response.data!.createdAt).toBeTruthy();
        expect(response.data!.updatedAt).toBeTruthy();
        expect(response.data!.isActive).toBe(true);
        done();
      });
    });

    it('should return 400 when required fields are missing', (done) => {
      const request = {
        name: '',
        organizationId: '',
        address: '',
        latitude: 0,
        longitude: 0
      };

      service.createTower(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('required');
        done();
      });
    });

    it('should return 400 when latitude is invalid', (done) => {
      const request = {
        name: 'Test Tower',
        organizationId: 'org-1',
        address: '123 Test St',
        latitude: 100,
        longitude: -74.0060
      };

      service.createTower(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('latitude');
        done();
      });
    });

    it('should return 400 when longitude is invalid', (done) => {
      const request = {
        name: 'Test Tower',
        organizationId: 'org-1',
        address: '123 Test St',
        latitude: 40.7128,
        longitude: -200
      };

      service.createTower(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('longitude');
        done();
      });
    });
  });

  describe('getTower', () => {
    it('should return tower by ID with location information', (done) => {
      service.getTower('tower-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data!.id).toBe('tower-1');
        expect(response.data!.name).toBeTruthy();
        expect(response.data!.latitude).toBeDefined();
        expect(response.data!.longitude).toBeDefined();
        expect(response.data!.status).toBeDefined();
        done();
      });
    });

    it('should return 404 when tower not found', (done) => {
      service.getTower('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        expect(response.message).toContain('not found');
        done();
      });
    });
  });

  describe('listTowers', () => {
    it('should return array of towers with status fields', (done) => {
      service.listTowers().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
        
        // Verify each tower has required fields
        response.data.forEach(tower => {
          expect(tower.latitude).toBeDefined();
          expect(tower.longitude).toBeDefined();
          expect(tower.status).toBeDefined();
        });
        done();
      });
    });

    it('should filter towers by organizationId', (done) => {
      service.listTowers({ filter: { organizationId: 'org-1' } }).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.every(tower => tower.organizationId === 'org-1')).toBe(true);
        done();
      });
    });

    it('should filter towers by status', (done) => {
      service.listTowers({ filter: { status: Status.ACTIVE } }).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.every(tower => tower.status === Status.ACTIVE)).toBe(true);
        done();
      });
    });
  });

  describe('updateTower', () => {
    it('should update tower and refresh updatedAt timestamp', (done) => {
      const updateRequest = {
        name: 'Updated Tower Name',
        address: '456 New St'
      };

      service.updateTower('tower-1', updateRequest).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data!.name).toBe(updateRequest.name);
        expect(response.data!.address).toBe(updateRequest.address);
        expect(response.data!.updatedAt).toBeTruthy();
        done();
      });
    });

    it('should update tower location coordinates', (done) => {
      const updateRequest = {
        latitude: 34.0522,
        longitude: -118.2437
      };

      service.updateTower('tower-1', updateRequest).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data!.latitude).toBe(updateRequest.latitude);
        expect(response.data!.longitude).toBe(updateRequest.longitude);
        done();
      });
    });

    it('should update tower status', (done) => {
      const updateRequest = {
        status: Status.INACTIVE
      };

      service.updateTower('tower-1', updateRequest).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data!.status).toBe(Status.INACTIVE);
        done();
      });
    });

    it('should return 404 when tower not found', (done) => {
      service.updateTower('non-existent-id', { name: 'Test' }).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        done();
      });
    });

    it('should return 400 when latitude is invalid', (done) => {
      service.updateTower('tower-1', { latitude: 100 }).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('latitude');
        done();
      });
    });

    it('should return 400 when status is invalid', (done) => {
      service.updateTower('tower-1', { status: 'INVALID_STATUS' }).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('status');
        done();
      });
    });
  });

  describe('deleteTower', () => {
    it('should delete tower successfully', (done) => {
      service.deleteTower('tower-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toContain('deleted successfully');
        done();
      });
    });

    it('should return 404 when tower not found', (done) => {
      service.deleteTower('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        done();
      });
    });
  });
});
