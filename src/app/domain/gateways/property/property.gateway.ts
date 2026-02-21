/**
 * Property Gateway - Abstract interface for property management
 */
import { Observable } from 'rxjs';
import { Property, PropertyRegistrationData } from '@domain/models/property/property.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class PropertyGateway {
  /**
   * Get all properties for the current admin
   */
  abstract getProperties(): Observable<Result<Property[]>>;

  /**
   * Register a new property
   * @param data - Property registration data
   */
  abstract registerProperty(data: PropertyRegistrationData): Observable<Result<Property>>;

  /**
   * Get property by ID
   * @param id - Property ID
   */
  abstract getPropertyById(id: string): Observable<Result<Property>>;
}
