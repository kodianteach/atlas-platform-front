import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthorizationComponent } from './authorization.component';
import { AuthorizationService } from '../../services/authorization.service';
import { AuthorizationFormValue, AuthorizationRecord } from '../../models/authorization.model';

describe('AuthorizationComponent', () => {
  let component: AuthorizationComponent;
  let fixture: ComponentFixture<AuthorizationComponent>;
  let mockAuthorizationService: jasmine.SpyObj<AuthorizationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockRecord: AuthorizationRecord = {
    id: '123',
    firstName: 'Juan',
    lastName: 'Pérez',
    idDocument: '12345678',
    entryType: 'visitor',
    hasVehicle: false,
    validityPeriod: 60,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000)
  };

  beforeEach(async () => {
    mockAuthorizationService = jasmine.createSpyObj('AuthorizationService', [
      'getAllAuthorizations',
      'createAuthorization'
    ]);
    mockAuthorizationService.getAllAuthorizations.and.returnValue(of([]));
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [AuthorizationComponent],
      providers: [
        { provide: AuthorizationService, useValue: mockAuthorizationService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with form and history hidden', () => {
    expect(component.showForm).toBe(false);
    expect(component.showHistory).toBe(false);
  });

  it('should subscribe to authorization records on init', () => {
    expect(mockAuthorizationService.getAllAuthorizations).toHaveBeenCalled();
  });

  it('should show form when plus button is clicked', () => {
    component.onPlusButtonClick();
    expect(component.showForm).toBe(true);
    expect(component.showHistory).toBe(false);
  });

  it('should show history when history icon is clicked', () => {
    component.onHistoryIconClick();
    expect(component.showHistory).toBe(true);
    expect(component.showForm).toBe(false);
  });

  it('should hide form when cancel is triggered', () => {
    component.showForm = true;
    component.onFormCancel();
    expect(component.showForm).toBe(false);
  });

  it('should hide history when close is triggered', () => {
    component.showHistory = true;
    component.onHistoryClose();
    expect(component.showHistory).toBe(false);
  });

  it('should navigate to access-permissions when manage is clicked', () => {
    component.onManageRecord(mockRecord);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/access-permissions']);
  });

  it('should create authorization and display success toast on form submit', (done) => {
    const formValue: AuthorizationFormValue = {
      firstName: 'Juan',
      lastName: 'Pérez',
      idDocument: '12345678',
      entryType: 'visitor',
      hasVehicle: false,
      validityPeriod: 60
    };

    mockAuthorizationService.createAuthorization.and.returnValue(of(mockRecord));

    component.onFormSubmit(formValue);

    setTimeout(() => {
      expect(mockAuthorizationService.createAuthorization).toHaveBeenCalledWith(formValue);
      expect(component.showForm).toBe(false);
      expect(component.showSuccessToast).toBe(true);
      expect(component.toastMessage).toBe('Autorización creada exitosamente');
      done();
    }, 0);
  });

  it('should display error toast on form submit failure', (done) => {
    const formValue: AuthorizationFormValue = {
      firstName: 'Juan',
      lastName: 'Pérez',
      idDocument: '12345678',
      entryType: 'visitor',
      hasVehicle: false,
      validityPeriod: 60
    };

    mockAuthorizationService.createAuthorization.and.returnValue(
      throwError(() => new Error('Storage error'))
    );

    component.onFormSubmit(formValue);

    setTimeout(() => {
      expect(component.showErrorToast).toBe(true);
      expect(component.toastMessage).toContain('Error al crear la autorización');
      done();
    }, 0);
  });

  it('should update records when service emits new data', (done) => {
    const records = [mockRecord];
    mockAuthorizationService.getAllAuthorizations.and.returnValue(of(records));

    const newComponent = new AuthorizationComponent(mockAuthorizationService, mockRouter);
    newComponent.ngOnInit();

    setTimeout(() => {
      expect(newComponent.records).toEqual(records);
      done();
    }, 0);
  });

  it('should hide success toast after 3 seconds', (done) => {
    const formValue: AuthorizationFormValue = {
      firstName: 'Juan',
      lastName: 'Pérez',
      idDocument: '12345678',
      entryType: 'visitor',
      hasVehicle: false,
      validityPeriod: 60
    };

    mockAuthorizationService.createAuthorization.and.returnValue(of(mockRecord));

    component.onFormSubmit(formValue);

    setTimeout(() => {
      expect(component.showSuccessToast).toBe(true);
    }, 100);

    setTimeout(() => {
      expect(component.showSuccessToast).toBe(false);
      done();
    }, 3100);
  });
});
