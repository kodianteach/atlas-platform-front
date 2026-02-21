/**
 * Unit Tests for Company Mock Service
 */

import { CompanyMockService } from './company-mock.service';
import { Status } from './types/entities.interface';
import { CreateCompanyRequest, UpdateCompanyRequest } from './types/requests.interface';

describe('CompanyMockService', () => {
  let service: CompanyMockService;

  beforeEach(() => {
    service = new CompanyMockService();
  });

  describe('createCompany', () => {
    
    it('should create a company with all required fields', (done) => {
      const request: CreateCompanyRequest = {
        name: 'Test Company',
        taxId: '12-3456789',
        address: '123 Test Street',
        contactEmail: 'test@company.com',
        contactPhone: '+1-555-0100'
      };

      service.createCompany(request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(response.data!.id).toBeDefined();
        expect(response.data!.name).toBe(request.name);
        expect(response.data!.taxId).toBe(request.taxId);
        expect(response.data!.address).toBe(request.address);
        expect(response.data!.contactEmail).toBe(request.contactEmail);
        expect(response.data!.contactPhone).toBe(request.contactPhone);
        expect(response.data!.status).toBe(Status.PENDING);
        expect(response.data!.createdAt).toBeDefined();
        expect(response.data!.updatedAt).toBeDefined();
        expect(response.data!.isActive).toBe(true);
        done();
      });
    });

    it('should return 400 when name is missing', (done) => {
      const request = {
        taxId: '12-3456789',
        address: '123 Test Street',
        contactEmail: 'test@company.com',
        contactPhone: '+1-555-0100'
      } as CreateCompanyRequest;

      service.createCompany(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('required');
        done();
      });
    });

    it('should return 400 when taxId is missing', (done) => {
      const request = {
        name: 'Test Company',
        address: '123 Test Street',
        contactEmail: 'test@company.com',
        contactPhone: '+1-555-0100'
      } as CreateCompanyRequest;

      service.createCompany(request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        done();
      });
    });

    it('should generate unique IDs for different companies', (done) => {
      const request: CreateCompanyRequest = {
        name: 'Test Company',
        taxId: '12-3456789',
        address: '123 Test Street',
        contactEmail: 'test@company.com',
        contactPhone: '+1-555-0100'
      };

      service.createCompany(request).subscribe(response1 => {
        service.createCompany(request).subscribe(response2 => {
          expect(response1.data!.id).not.toBe(response2.data!.id);
          done();
        });
      });
    });
  });

  describe('getCompany', () => {
    
    it('should return company data for valid ID', (done) => {
      service.getCompany('company-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data!.id).toBe('company-1');
        expect(response.data!.name).toBeDefined();
        expect(response.data!.taxId).toBeDefined();
        expect(response.data!.address).toBeDefined();
        expect(response.data!.contactEmail).toBeDefined();
        expect(response.data!.contactPhone).toBeDefined();
        expect(response.data!.status).toBeDefined();
        done();
      });
    });

    it('should return 404 for non-existent company', (done) => {
      service.getCompany('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        expect(response.message).toContain('not found');
        done();
      });
    });

    it('should include all company fields in response', (done) => {
      service.getCompany('company-1').subscribe(response => {
        const company = response.data!;
        expect(company.name).toBeDefined();
        expect(company.taxId).toBeDefined();
        expect(company.address).toBeDefined();
        expect(company.status).toBeDefined();
        expect(company.contactEmail).toBeDefined();
        expect(company.contactPhone).toBeDefined();
        expect(company.createdAt).toBeDefined();
        expect(company.updatedAt).toBeDefined();
        expect(company.isActive).toBeDefined();
        done();
      });
    });
  });

  describe('listCompanies', () => {
    
    it('should return array of companies', (done) => {
      service.listCompanies().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should filter companies by ACTIVE status', (done) => {
      service.listCompanies({ filter: { status: Status.ACTIVE } }).subscribe(response => {
        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
        response.data.forEach(company => {
          expect(company.status).toBe(Status.ACTIVE);
        });
        done();
      });
    });

    it('should filter companies by PENDING status', (done) => {
      service.listCompanies({ filter: { status: Status.PENDING } }).subscribe(response => {
        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
        response.data.forEach(company => {
          expect(company.status).toBe(Status.PENDING);
        });
        done();
      });
    });

    it('should filter companies by INACTIVE status', (done) => {
      service.listCompanies({ filter: { status: Status.INACTIVE } }).subscribe(response => {
        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
        response.data.forEach(company => {
          expect(company.status).toBe(Status.INACTIVE);
        });
        done();
      });
    });

    it('should return only active companies (isActive=true)', (done) => {
      service.listCompanies().subscribe(response => {
        expect(response.success).toBe(true);
        response.data.forEach(company => {
          expect(company.isActive).toBe(true);
        });
        done();
      });
    });
  });

  describe('updateCompany', () => {
    
    it('should update company name', (done) => {
      const request: UpdateCompanyRequest = {
        name: 'Updated Company Name'
      };

      service.updateCompany('company-1', request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.data!.name).toBe('Updated Company Name');
        done();
      });
    });

    it('should update company address', (done) => {
      const request: UpdateCompanyRequest = {
        address: '456 New Address'
      };

      service.updateCompany('company-1', request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data!.address).toBe('456 New Address');
        done();
      });
    });

    it('should update company status', (done) => {
      const request: UpdateCompanyRequest = {
        status: Status.ACTIVE
      };

      service.updateCompany('company-4', request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data!.status).toBe(Status.ACTIVE);
        done();
      });
    });

    it('should update multiple fields at once', (done) => {
      const request: UpdateCompanyRequest = {
        name: 'New Name',
        address: 'New Address',
        contactEmail: 'new@email.com',
        contactPhone: '+1-555-9999',
        status: Status.ACTIVE
      };

      service.updateCompany('company-1', request).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data!.name).toBe('New Name');
        expect(response.data!.address).toBe('New Address');
        expect(response.data!.contactEmail).toBe('new@email.com');
        expect(response.data!.contactPhone).toBe('+1-555-9999');
        expect(response.data!.status).toBe(Status.ACTIVE);
        done();
      });
    });

    it('should update updatedAt timestamp', (done) => {
      const beforeUpdate = new Date().getTime();
      
      service.updateCompany('company-1', { name: 'Updated' }).subscribe(response => {
        const updatedAt = new Date(response.data!.updatedAt).getTime();
        expect(updatedAt).toBeGreaterThanOrEqual(beforeUpdate);
        done();
      });
    });

    it('should return 404 for non-existent company', (done) => {
      service.updateCompany('non-existent-id', { name: 'Test' }).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        done();
      });
    });

    it('should return 400 for invalid status value', (done) => {
      const request: UpdateCompanyRequest = {
        status: 'INVALID_STATUS'
      };

      service.updateCompany('company-1', request).subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(400);
        expect(response.message).toContain('Invalid status');
        done();
      });
    });

    it('should preserve unchanged fields', (done) => {
      service.getCompany('company-1').subscribe(originalResponse => {
        const original = originalResponse.data!;
        
        service.updateCompany('company-1', { name: 'New Name' }).subscribe(updateResponse => {
          const updated = updateResponse.data!;
          expect(updated.taxId).toBe(original.taxId);
          expect(updated.contactEmail).toBe(original.contactEmail);
          expect(updated.contactPhone).toBe(original.contactPhone);
          done();
        });
      });
    });
  });

  describe('deleteCompany', () => {
    
    it('should delete company successfully', (done) => {
      service.deleteCompany('company-1').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.status).toBe(200);
        expect(response.message).toContain('deleted successfully');
        done();
      });
    });

    it('should return 404 for non-existent company', (done) => {
      service.deleteCompany('non-existent-id').subscribe(response => {
        expect(response.success).toBe(false);
        expect(response.status).toBe(404);
        done();
      });
    });
  });

  describe('ApiResponse Structure', () => {
    
    it('should return complete ApiResponse structure for create', (done) => {
      const request: CreateCompanyRequest = {
        name: 'Test',
        taxId: '12-3456789',
        address: '123 Test',
        contactEmail: 'test@test.com',
        contactPhone: '+1-555-0100'
      };

      service.createCompany(request).subscribe(response => {
        expect(response.success).toBeDefined();
        expect(response.status).toBeDefined();
        expect(response.message).toBeDefined();
        expect(response.data).toBeDefined();
        expect(response.timestamp).toBeDefined();
        expect(response.path).toBeDefined();
        done();
      });
    });

    it('should have valid ISO 8601 timestamp', (done) => {
      service.listCompanies().subscribe(response => {
        expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        done();
      });
    });
  });
});
