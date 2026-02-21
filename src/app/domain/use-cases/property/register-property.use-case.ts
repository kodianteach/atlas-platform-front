/**
 * Register Property Use Case
 */
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { PropertyGateway } from '@domain/gateways/property/property.gateway';
import { Property, PropertyRegistrationData } from '@domain/models/property/property.model';
import { Result, failure } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class RegisterPropertyUseCase {
  private readonly propertyGateway = inject(PropertyGateway);

  execute(data: PropertyRegistrationData): Observable<Result<Property>> {
    return this.propertyGateway.registerProperty(data).pipe(
      catchError(error => of(failure<Property>({
        code: 'REGISTER_PROPERTY_ERROR',
        message: error.message || 'Error registering property',
        timestamp: new Date()
      })))
    );
  }
}
