import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap, catchError } from 'rxjs/operators';
import { Authorization, AuthorizationRecord, AuthorizationFormValue } from '../models/authorization.model';

/**
 * Service for managing authorization data and operations
 * Provides reactive data streams using RxJS observables
 */
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  /** Internal state management using BehaviorSubject for reactive updates */
  private authorizationsSubject = new BehaviorSubject<Authorization[]>([]);
  
  /** Public observable stream of authorizations */
  public authorizations$ = this.authorizationsSubject.asObservable();

  /** Internal state for authorization records */
  private recordsSubject = new BehaviorSubject<AuthorizationRecord[]>([]);
  
  /** Public observable stream of authorization records */
  public records$ = this.recordsSubject.asObservable();

  constructor() {
    // Initialize with mock data for development
    this.initializeMockData();
    this.initializeMockRecords();
  }

  /**
   * Get all authorizations as an observable
   * @returns Observable stream of authorization array
   */
  getAuthorizations(): Observable<Authorization[]> {
    return this.authorizations$;
  }

  /**
   * Get count of active authorizations
   * @returns Observable stream of active authorization count
   */
  getActiveCount(): Observable<number> {
    return this.authorizations$.pipe(
      map(auths => auths.filter(auth => auth.isActive).length)
    );
  }

  /**
   * Toggle the active status of an authorization
   * @param id - Authorization ID to toggle
   * @returns Observable of the updated authorization
   */
  toggleAuthorizationStatus(id: string): Observable<Authorization> {
    const currentAuths = this.authorizationsSubject.value;
    const authIndex = currentAuths.findIndex(auth => auth.id === id);

    if (authIndex === -1) {
      return throwError(() => new Error(`Authorization with id ${id} not found`));
    }

    // Create updated authorization with toggled status
    const updatedAuth: Authorization = {
      ...currentAuths[authIndex],
      isActive: !currentAuths[authIndex].isActive,
      updatedAt: new Date()
    };

    // Update the authorizations array
    const updatedAuths = [
      ...currentAuths.slice(0, authIndex),
      updatedAuth,
      ...currentAuths.slice(authIndex + 1)
    ];

    // Simulate API call delay
    return of(updatedAuth).pipe(
      delay(300),
      tap(() => {
        // Update the subject with new state
        this.authorizationsSubject.next(updatedAuths);
      }),
      catchError(error => {
        console.error('Error toggling authorization status:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Add a new authorization
   * @param authorization - Authorization to add
   * @returns Observable of the added authorization
   */
  addAuthorization(authorization: Authorization): Observable<Authorization> {
    const currentAuths = this.authorizationsSubject.value;
    const newAuth: Authorization = {
      ...authorization,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return of(newAuth).pipe(
      delay(300),
      tap(() => {
        this.authorizationsSubject.next([...currentAuths, newAuth]);
      })
    );
  }

  /**
   * Get all authorization records (for compatibility with existing components)
   * @returns Observable stream of authorization records
   */
  getAllAuthorizations(): Observable<AuthorizationRecord[]> {
    return this.records$;
  }

  /**
   * Create a new authorization from form value (for compatibility with existing components)
   * @param formValue - Form data for creating authorization
   * @returns Observable of the created authorization record
   */
  createAuthorization(formValue: AuthorizationFormValue): Observable<AuthorizationRecord> {
    const newRecord: AuthorizationRecord = {
      id: this.generateId(),
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      fullName: formValue.fullName || `${formValue.firstName} ${formValue.lastName}`,
      idDocument: formValue.idDocument,
      entryType: formValue.entryType,
      hasVehicle: formValue.hasVehicle,
      licensePlate: formValue.licensePlate,
      validityPeriod: formValue.validityPeriod,
      visitDate: formValue.visitDate,
      visitTime: formValue.visitTime,
      orderOrigin: formValue.orderOrigin,
      orderType: formValue.orderType,
      courierCompany: formValue.courierCompany,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + formValue.validityPeriod * 60 * 1000)
    };

    return of(newRecord).pipe(
      delay(300),
      tap(() => {
        const currentRecords = this.recordsSubject.value;
        this.recordsSubject.next([...currentRecords, newRecord]);
      })
    );
  }

  /**
   * Generate a unique ID for new authorizations
   * @returns Unique identifier string
   */
  private generateId(): string {
    return `auth-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Initialize service with mock data for development
   * In production, this would fetch from a backend API
   */
  private initializeMockData(): void {
    const mockAuthorizations: Authorization[] = [
      {
        id: '1',
        name: 'Family Member',
        type: 'permanent',
        isActive: true,
        icon: 'person',
        details: {
          accessType: 'Permanent Access',
          permissions: 'Full Permissions'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Cleaning Service',
        type: 'scheduled',
        isActive: true,
        icon: 'cleaning',
        details: {
          schedule: {
            days: ['Mon', 'Wed', 'Fri'],
            timeRange: '09:00 AM - 02:00 PM'
          }
        },
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: '3',
        name: 'Delivery Person',
        type: 'scheduled',
        isActive: false,
        icon: 'delivery',
        details: {
          schedule: {
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            timeRange: '08:00 AM - 06:00 PM'
          }
        },
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-25')
      }
    ];

    this.authorizationsSubject.next(mockAuthorizations);
  }

  /**
   * Initialize service with mock authorization records for development
   * In production, this would fetch from a backend API
   */
  private initializeMockRecords(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const mockRecords: AuthorizationRecord[] = [
      {
        id: 'rec-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        fullName: 'Juan Pérez',
        idDocument: '1234567890',
        entryType: 'visitor',
        hasVehicle: true,
        licensePlate: 'ABC-123',
        validityPeriod: 240,
        visitDate: tomorrow.toISOString().split('T')[0],
        visitTime: '14:00',
        createdAt: new Date(),
        expiresAt: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000)
      },
      {
        id: 'rec-2',
        firstName: 'María',
        lastName: 'González',
        fullName: 'María González',
        idDocument: '0987654321',
        entryType: 'service',
        hasVehicle: false,
        validityPeriod: 120,
        visitDate: tomorrow.toISOString().split('T')[0],
        visitTime: '10:00',
        createdAt: new Date(),
        expiresAt: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000)
      },
      {
        id: 'rec-3',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        fullName: 'Carlos Rodríguez',
        idDocument: '5555555555',
        entryType: 'courier',
        hasVehicle: true,
        licensePlate: 'XYZ-789',
        validityPeriod: 30,
        visitDate: today.toISOString().split('T')[0],
        visitTime: '16:30',
        orderOrigin: 'Amazon',
        orderType: 'Paquete',
        courierCompany: 'DHL',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000)
      },
      {
        id: 'rec-4',
        firstName: 'Ana',
        lastName: 'Martínez',
        fullName: 'Ana Martínez',
        idDocument: '1111111111',
        entryType: 'visitor',
        hasVehicle: false,
        validityPeriod: 180,
        visitDate: nextWeek.toISOString().split('T')[0],
        visitTime: '15:00',
        createdAt: new Date(),
        expiresAt: new Date(nextWeek.getTime() + 3 * 60 * 60 * 1000)
      },
      {
        id: 'rec-5',
        firstName: 'Luis',
        lastName: 'Fernández',
        fullName: 'Luis Fernández',
        idDocument: '2222222222',
        entryType: 'service',
        hasVehicle: true,
        licensePlate: 'DEF-456',
        validityPeriod: 300,
        visitDate: nextWeek.toISOString().split('T')[0],
        visitTime: '09:00',
        createdAt: new Date(),
        expiresAt: new Date(nextWeek.getTime() + 5 * 60 * 60 * 1000)
      }
    ];

    this.recordsSubject.next(mockRecords);
  }
}
