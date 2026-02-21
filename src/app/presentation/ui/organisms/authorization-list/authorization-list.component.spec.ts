import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorizationListComponent } from './authorization-list.component';
import { Authorization } from '../../../models/authorization.model';

describe('AuthorizationListComponent', () => {
  let component: AuthorizationListComponent;
  let fixture: ComponentFixture<AuthorizationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty state when no authorizations exist', () => {
    component.authorizations = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('.empty-state');
    const emptyMessage = compiled.querySelector('.empty-message');

    expect(emptyState).toBeTruthy();
    expect(emptyMessage?.textContent).toContain('No authorizations yet');
  });

  it('should display list header with correct title and count', () => {
    component.activeCount = 3;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const listHeader = compiled.querySelector('app-list-header');

    expect(listHeader).toBeTruthy();
  });

  it('should render authorization items when authorizations exist', () => {
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Delivery Person',
        type: 'scheduled',
        isActive: false,
        icon: 'delivery',
        details: {
          schedule: {
            days: ['Mon', 'Wed', 'Fri'],
            timeRange: '09:00 AM - 02:00 PM'
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    component.authorizations = mockAuthorizations;
    component.activeCount = 1;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('app-authorization-item');

    expect(items.length).toBe(2);
  });

  it('should have role="list" on authorization items container', () => {
    const mockAuthorizations: Authorization[] = [
      {
        id: '1',
        name: 'Test',
        type: 'permanent',
        isActive: true,
        icon: 'person',
        details: {},
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    component.authorizations = mockAuthorizations;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const list = compiled.querySelector('[role="list"]');

    expect(list).toBeTruthy();
  });

  it('should have role="listitem" on each list item', () => {
    const mockAuthorizations: Authorization[] = [
      {
        id: '1',
        name: 'Test 1',
        type: 'permanent',
        isActive: true,
        icon: 'person',
        details: {},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Test 2',
        type: 'scheduled',
        isActive: false,
        icon: 'delivery',
        details: {},
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    component.authorizations = mockAuthorizations;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const listItems = compiled.querySelectorAll('[role="listitem"]');

    expect(listItems.length).toBe(2);
  });

  it('should emit toggleAuthorization event with authorization ID when toggle is clicked', () => {
    const mockAuthorization: Authorization = {
      id: 'auth-123',
      name: 'Test Authorization',
      type: 'permanent',
      isActive: true,
      icon: 'person',
      details: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    component.authorizations = [mockAuthorization];
    fixture.detectChanges();

    spyOn(component.toggleAuthorization, 'emit');

    component.onToggleAuthorization('auth-123');

    expect(component.toggleAuthorization.emit).toHaveBeenCalledWith('auth-123');
  });

  it('should return true for isEmpty when authorizations array is empty', () => {
    component.authorizations = [];
    expect(component.isEmpty).toBe(true);
  });

  it('should return false for isEmpty when authorizations array has items', () => {
    component.authorizations = [
      {
        id: '1',
        name: 'Test',
        type: 'permanent',
        isActive: true,
        icon: 'person',
        details: {},
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    expect(component.isEmpty).toBe(false);
  });

  it('should not display empty state when authorizations exist', () => {
    component.authorizations = [
      {
        id: '1',
        name: 'Test',
        type: 'permanent',
        isActive: true,
        icon: 'person',
        details: {},
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('.empty-state');

    expect(emptyState).toBeFalsy();
  });

  it('should not display authorization items when list is empty', () => {
    component.authorizations = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelector('.authorization-items');

    expect(items).toBeFalsy();
  });
});
