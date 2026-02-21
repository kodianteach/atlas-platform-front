import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { 
  Property, 
  PropertyRegistrationRequest, 
  PropertyRegistrationResponse,
  PropertyStatus 
} from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private mockProperties: Property[] = [];
  private nextId = 1;
  private useMockData = true; // Toggle for mock vs real API

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data for testing
   */
  private initializeMockData(): void {
    // Sample properties
    const sampleProperties: Property[] = [
      {
        id: 'prop-001',
        name: 'Sunset Towers',
        taxId: '12.345.678/0001-90',
        totalUnits: 48,
        propertyType: 'condominio',
        adminId: 'user-002',
        status: PropertyStatus.ACTIVE,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'prop-002',
        name: 'Villa Hermosa',
        taxId: '98.765.432/0001-10',
        totalUnits: 120,
        propertyType: 'conjunto',
        adminId: 'user-002',
        status: PropertyStatus.ACTIVE,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'prop-003',
        name: 'Residencial Los Pinos',
        taxId: '45.678.901/0001-23',
        totalUnits: 85,
        propertyType: 'ciudadela',
        adminId: 'user-003',
        status: PropertyStatus.ACTIVE,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 'prop-004',
        name: 'Torre del Mar',
        taxId: '23.456.789/0001-45',
        totalUnits: 64,
        propertyType: 'condominio',
        adminId: 'user-003',
        status: PropertyStatus.PENDING,
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        updatedAt: new Date(Date.now() - 345600000).toISOString()
      }
    ];

    this.mockProperties = [...sampleProperties];
    this.nextId = sampleProperties.length + 1;
  }

  /**
   * Register a new property
   * @param data Property registration data
   * @returns Observable of registration response
   */
  registerProperty(data: PropertyRegistrationRequest): Observable<PropertyRegistrationResponse> {
    // Check for duplicate tax ID
    const duplicate = this.mockProperties.find(p => p.taxId === data.taxId);
    if (duplicate) {
      return of({
        success: false,
        error: 'This Tax ID is already registered.'
      }).pipe(delay(800));
    }

    // Create new property
    const newProperty: Property = {
      id: `prop-${String(this.nextId++).padStart(3, '0')}`,
      name: data.name,
      taxId: data.taxId,
      totalUnits: data.totalUnits,
      propertyType: data.propertyType,
      adminId: 'user-001', // TODO: Get from auth service
      status: PropertyStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockProperties.push(newProperty);

    return of({
      success: true,
      property: newProperty
    }).pipe(delay(800));
  }

  /**
   * Get all properties for the current admin
   * @returns Observable of property array
   */
  getAdminProperties(): Observable<Property[]> {
    return of(this.mockProperties).pipe(delay(300));
  }

  /**
   * Get a single property by ID
   * @param id Property ID
   * @returns Observable of property
   */
  getProperty(id: string): Observable<Property> {
    const property = this.mockProperties.find(p => p.id === id);
    if (!property) {
      return throwError(() => ({
        status: 404,
        error: { message: 'Property not found' }
      })).pipe(delay(300));
    }
    return of(property).pipe(delay(300));
  }
}
