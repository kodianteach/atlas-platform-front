import { TestBed } from '@angular/core/testing';
import { PropertyService } from './property.service';
import { PropertyRegistrationRequest, PropertyStatus } from '../models/property.model';

describe('PropertyService', () => {
  let service: PropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerProperty', () => {
    it('should register a new property successfully', (done) => {
      const request: PropertyRegistrationRequest = {
        name: 'Sunset Towers',
        taxId: '12.345.678/0001-90',
        totalUnits: 48,
        propertyType: 'condominio'
      };

      service.registerProperty(request).subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
          expect(response.property).toBeDefined();
          expect(response.property?.name).toBe('Sunset Towers');
          expect(response.property?.taxId).toBe('12.345.678/0001-90');
          expect(response.property?.totalUnits).toBe(48);
          expect(response.property?.propertyType).toBe('condominio');
          expect(response.property?.status).toBe(PropertyStatus.ACTIVE);
          done();
        },
        error: (error) => {
          fail('Should not have errored');
          done();
        }
      });
    });

    it('should reject duplicate tax ID', (done) => {
      const request: PropertyRegistrationRequest = {
        name: 'First Property',
        taxId: '11.111.111/0001-11',
        totalUnits: 20,
        propertyType: 'conjunto'
      };

      // Register first property
      service.registerProperty(request).subscribe({
        next: () => {
          // Try to register with same tax ID
          service.registerProperty(request).subscribe({
            next: () => {
              fail('Should have errored with duplicate');
              done();
            },
            error: (error) => {
              expect(error.status).toBe(409);
              expect(error.error.message).toContain('Tax ID');
              done();
            }
          });
        }
      });
    });
  });

  describe('getAdminProperties', () => {
    it('should return empty array initially', (done) => {
      service.getAdminProperties().subscribe({
        next: (properties) => {
          expect(properties).toEqual([]);
          done();
        }
      });
    });

    it('should return registered properties', (done) => {
      const request: PropertyRegistrationRequest = {
        name: 'Test Property',
        taxId: '22.222.222/0001-22',
        totalUnits: 30,
        propertyType: 'ciudadela'
      };

      service.registerProperty(request).subscribe({
        next: () => {
          service.getAdminProperties().subscribe({
            next: (properties) => {
              expect(properties.length).toBe(1);
              expect(properties[0].name).toBe('Test Property');
              done();
            }
          });
        }
      });
    });
  });

  describe('getProperty', () => {
    it('should return property by ID', (done) => {
      const request: PropertyRegistrationRequest = {
        name: 'Specific Property',
        taxId: '33.333.333/0001-33',
        totalUnits: 15,
        propertyType: 'condominio'
      };

      service.registerProperty(request).subscribe({
        next: (response) => {
          const propertyId = response.property!.id;
          service.getProperty(propertyId).subscribe({
            next: (property) => {
              expect(property.id).toBe(propertyId);
              expect(property.name).toBe('Specific Property');
              done();
            }
          });
        }
      });
    });

    it('should error for non-existent property', (done) => {
      service.getProperty('non-existent-id').subscribe({
        next: () => {
          fail('Should have errored');
          done();
        },
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });
    });
  });
});
