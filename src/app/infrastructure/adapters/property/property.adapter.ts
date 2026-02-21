/**
 * Property Adapter - Implements PropertyGateway for property management
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { PropertyGateway } from '@domain/gateways/property/property.gateway';
import { Property, PropertyRegistrationData, PropertyStatus } from '@domain/models/property/property.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PropertyAdapter extends PropertyGateway {
  private readonly http = inject(HttpClient);

  private readonly PROPERTY_ENDPOINT = `${environment.apiUrl}/properties`;

  /** In-memory mock storage */
  private properties: Property[] = [];

  override getProperties(): Observable<Result<Property[]>> {
    if (environment.useMockData) {
      return of(success(this.properties)).pipe(delay(300));
    }

    return this.http.get<Property[]>(this.PROPERTY_ENDPOINT).pipe(
      map(properties => success(properties)),
      catchError(error => of(failure<Property[]>({
        code: 'GET_PROPERTIES_ERROR',
        message: error.message || 'Error loading properties',
        timestamp: new Date()
      })))
    );
  }

  override registerProperty(data: PropertyRegistrationData): Observable<Result<Property>> {
    if (environment.useMockData) {
      return this.mockRegisterProperty(data);
    }

    return this.http.post<Property>(this.PROPERTY_ENDPOINT, {
      name: data.condominiumName,
      taxId: data.taxId,
      totalUnits: data.totalUnits,
      propertyType: data.propertyType
    }).pipe(
      map(property => success(property, 'Property registered successfully')),
      catchError(error => of(failure<Property>({
        code: 'REGISTER_PROPERTY_ERROR',
        message: error.message || 'Error registering property',
        timestamp: new Date()
      })))
    );
  }

  override getPropertyById(id: string): Observable<Result<Property>> {
    if (environment.useMockData) {
      const property = this.properties.find(p => p.id === id);
      if (property) return of(success(property));
      return of(failure<Property>({ code: 'NOT_FOUND', message: 'Property not found', timestamp: new Date() }));
    }

    return this.http.get<Property>(`${this.PROPERTY_ENDPOINT}/${id}`).pipe(
      map(property => success(property)),
      catchError(error => of(failure<Property>({
        code: 'GET_PROPERTY_ERROR',
        message: error.message || 'Error loading property',
        timestamp: new Date()
      })))
    );
  }

  private mockRegisterProperty(data: PropertyRegistrationData): Observable<Result<Property>> {
    const property: Property = {
      id: `property-${Date.now()}`,
      name: data.condominiumName,
      taxId: data.taxId,
      totalUnits: data.totalUnits,
      propertyType: data.propertyType,
      adminId: 'user-1',
      status: PropertyStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.properties.push(property);
    return of(success(property, 'Property registered successfully')).pipe(delay(500));
  }
}
