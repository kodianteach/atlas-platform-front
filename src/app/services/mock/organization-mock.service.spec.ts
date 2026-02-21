/**
 * Unit Tests for OrganizationMockService
 */

import { TestBed } from '@angular/core/testing';
import { OrganizationMockService } from './organization-mock.service';
import { Organization } from './types/entities.interface';
import { ApiResponse } from './types/api-response.interface';

describe('OrganizationMockService', () => {
  let service: OrganizationMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationMockService]
    });
    service = TestBed.inject(OrganizationMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createOrganization', () => {
    it('should create a new organization with generated ID and audit fields', (done) => {
      const request = {
        name: 'Test Organization',
        description: 'Test description',
        companyId: 'company-1'
      };

      service.createOrganization(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(response.data!.id).toBeTruthy();
        expect(response.data!.name).toBe(request.name);
        expect(response.data!.description).toBe(request.description);
        expect(response.data!.companyId).toBe(request.companyId);
        expect(response.data!.createdAt).toBeTruthy();
        expect(response.data!.updatedAt).toBeTruthy();
        expect(response.data!.isActive).toBe(true);
        done();
      });
    });

    it('should create organization with parent relationship', (done) => {
      const request = {
        name: 'Child Organization',
        description: 'Child description',
        companyId: 'company-1',
        parentOrganizationId: 'org-1'
      };

      service.createOrganization(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data!.parentOrganizationId).toBe('org-1');
        done();
      });
    });

    it('should return 400 when required fields are missing', (done) => {
      const request = {
        name: 'Test',
        description: '',
        companyId: ''
      };

      service.createOrganization(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('required');
        done();
      });
    });

    it('should return 400 when parent organization does not exist', (done) => {
      const request = {
        name: 'Test Organization',
        description: 'Test description',
        companyId: 'company-1',
        parentOrganizationId: 'non-existent-org'
      };

      service.createOrganization(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('Parent organization');
        done();
      });
    });
  });

  describe('getOrganization', () => {
    it('should return organization by ID', (done) => {
      service.getOrganization('org-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data!.id).toBe('org-1');
        expect(response.data!.name).toBeTruthy();
        expect(response.data!.description).toBeTruthy();
        expect(response.data!.companyId).toBeTruthy();
        done();
      });
    });

    it('should return 404 when organization not found', (done) => {
      service.getOrganization('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        expect(response.message).toContain('not found');
        done();
      });
    });
  });

  describe('listOrganizations', () => {
    it('should return array of organizations', (done) => {
      service.listOrganizations().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should filter organizations by companyId', (done) => {
      service.listOrganizations({ filter: { companyId: 'company-1' } }).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.every(org => org.companyId === 'company-1')).toBe(true);
        done();
      });
    });

    it('should filter organizations by parentOrganizationId', (done) => {
      service.listOrganizations({ filter: { parentOrganizationId: 'org-1' } }).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data.every(org => org.parentOrganizationId === 'org-1')).toBe(true);
        done();
      });
    });
  });

  describe('getOrganizationHierarchy', () => {
    it('should return organization hierarchy including descendants', (done) => {
      service.getOrganizationHierarchy('org-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data).toBeTruthy();
        expect(response.data!.length).toBeGreaterThan(1);
        
        // First item should be the root organization
        expect(response.data![0].id).toBe('org-1');
        
        // Should include child organizations
        const hasChildren = response.data!.some(org => org.parentOrganizationId === 'org-1');
        expect(hasChildren).toBe(true);
        done();
      });
    });

    it('should return 404 when root organization not found', (done) => {
      service.getOrganizationHierarchy('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        done();
      });
    });

    it('should return only root organization if no children exist', (done) => {
      service.getOrganizationHierarchy('org-9').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toBeTruthy();
        expect(response.data!.length).toBe(1);
        expect(response.data![0].id).toBe('org-9');
        done();
      });
    });
  });

  describe('updateOrganization', () => {
    it('should update organization and refresh updatedAt timestamp', (done) => {
      const updateRequest = {
        name: 'Updated Name',
        description: 'Updated description'
      };

      service.updateOrganization('org-1', updateRequest).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data!.name).toBe(updateRequest.name);
        expect(response.data!.description).toBe(updateRequest.description);
        expect(response.data!.updatedAt).toBeTruthy();
        done();
      });
    });

    it('should update parent organization relationship', (done) => {
      const updateRequest = {
        parentOrganizationId: 'org-1'
      };

      service.updateOrganization('org-7', updateRequest).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data!.parentOrganizationId).toBe('org-1');
        done();
      });
    });

    it('should return 404 when organization not found', (done) => {
      service.updateOrganization('non-existent-id', { name: 'Test' }).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        done();
      });
    });

    it('should return 400 when parent organization does not exist', (done) => {
      const updateRequest = {
        parentOrganizationId: 'non-existent-org'
      };

      service.updateOrganization('org-1', updateRequest).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('Parent organization');
        done();
      });
    });

    it('should return 400 when trying to set organization as its own parent', (done) => {
      const updateRequest = {
        parentOrganizationId: 'org-1'
      };

      service.updateOrganization('org-1', updateRequest).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('cannot be its own parent');
        done();
      });
    });
  });

  describe('deleteOrganization', () => {
    it('should delete organization successfully', (done) => {
      service.deleteOrganization('org-9').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toContain('deleted successfully');
        done();
      });
    });

    it('should return 404 when organization not found', (done) => {
      service.deleteOrganization('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        done();
      });
    });

    it('should return 400 when organization has active children', (done) => {
      service.deleteOrganization('org-1').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('active child organizations');
        done();
      });
    });
  });
});
