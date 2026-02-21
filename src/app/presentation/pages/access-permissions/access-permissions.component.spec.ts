import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AccessPermissionsComponent } from './access-permissions.component';
import { AuthorizationService } from '../../services/authorization.service';
import { Authorization } from '../../models/authorization.model';

describe('AccessPermissionsComponent', () => {
  let component: AccessPermissionsComponent;
  let fixture: ComponentFixture<AccessPermissionsComponent>;
  let mockAuthorizationService: jasmine.SpyObj<AuthorizationService>;
  let mockRouter: jasmine.SpyObj<Router>;

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
      isActive: false,
      icon: 'cleaning',
      details: {
        schedule: {
          days: ['Mon', 'Wed', 'Fri'],
          timeRange: '09:00 AM - 02:00 PM'
        }
      },
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }
  ];

  beforeEach(async () => {
    mockAuthorizationService = jasmine.createSpyObj('AuthorizationService', [
      'getAuthorizations',
      'toggleAuthorizationStatus'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockAuthorizationService.getAuthorizations.and.returnValue(of(mockAuthorizations));

    await TestBed.configureTestingModule({
      imports: [AccessPermissionsComponent],
      providers: [
        { provide: AuthorizationService, useValue: mockAuthorizationService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessPermissionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load authorizations on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockAuthorizationService.getAuthorizations).toHaveBeenCalled();
    expect(component.authorizations).toEqual(mockAuthorizations);
    expect(component.isLoading).toBe(false);
  }));

  it('should calculate active count correctly', fakeAsync(() => {
    fixture.detectChanges();
    flush(); // Flush all pending microtasks

    expect(component.activeCount).toBe(1); // Only one active authorization
  }));

  it('should handle service error', () => {
    mockAuthorizationService.getAuthorizations.and.returnValue(
      throwError(() => new Error('Service error'))
    );

    fixture.detectChanges();

    expect(component.error).toBe('Failed to load authorizations');
    expect(component.isLoading).toBe(false);
  });

  it('should navigate back when back button clicked', () => {
    component.onBackClick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to history when history button clicked', () => {
    component.onHistoryClick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/authorization-history']);
  });

  it('should navigate to form when create button clicked', () => {
    component.onCreateClick();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/authorization-form']);
  });

  it('should toggle authorization status', () => {
    const updatedAuth: Authorization = { ...mockAuthorizations[0], isActive: false };
    mockAuthorizationService.toggleAuthorizationStatus.and.returnValue(of(updatedAuth));

    fixture.detectChanges();
    component.onToggleAuthorization('1');

    expect(mockAuthorizationService.toggleAuthorizationStatus).toHaveBeenCalledWith('1');
  });

  it('should handle toggle error', () => {
    mockAuthorizationService.toggleAuthorizationStatus.and.returnValue(
      throwError(() => new Error('Toggle error'))
    );

    fixture.detectChanges();
    const initialAuthorizations = [...component.authorizations];
    const initialActiveCount = component.activeCount;
    
    component.onToggleAuthorization('1');

    // Should revert state on error
    expect(component.authorizations).toEqual(initialAuthorizations);
    expect(component.activeCount).toBe(initialActiveCount);
    
    // Should show error toast
    expect(component.toggleErrorMessage).toBe('Failed to update authorization status. Please try again.');
  });

  it('should dismiss toggle error toast', () => {
    component.toggleErrorMessage = 'Some error';
    
    component.dismissToggleError();
    
    expect(component.toggleErrorMessage).toBeNull();
  });

  it('should auto-hide toggle error after 5 seconds', fakeAsync(() => {
    mockAuthorizationService.toggleAuthorizationStatus.and.returnValue(
      throwError(() => new Error('Toggle error'))
    );

    fixture.detectChanges();
    component.onToggleAuthorization('1');

    expect(component.toggleErrorMessage).toBeTruthy();
    
    tick(5000);
    
    expect(component.toggleErrorMessage).toBeNull();
  }));
});
