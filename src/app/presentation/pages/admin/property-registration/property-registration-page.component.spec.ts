import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PropertyRegistrationPageComponent } from './property-registration-page.component';
import { PropertyService } from '../../../services/property.service';
import { PropertyRegistrationData, PropertyStatus } from '../../../models/property.model';

describe('PropertyRegistrationPageComponent', () => {
  let component: PropertyRegistrationPageComponent;
  let fixture: ComponentFixture<PropertyRegistrationPageComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPropertyService: jasmine.SpyObj<PropertyService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPropertyService = jasmine.createSpyObj('PropertyService', ['registerProperty']);

    await TestBed.configureTestingModule({
      imports: [PropertyRegistrationPageComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PropertyService, useValue: mockPropertyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyRegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isSubmitting as false', () => {
    expect(component.isSubmitting).toBe(false);
  });

  it('should initialize with empty generalError', () => {
    expect(component.generalError).toBe('');
  });

  it('should navigate to profile setup when handleBack is called', () => {
    component.handleBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/profile-setup']);
  });

  describe('handleSubmit', () => {
    const testData: PropertyRegistrationData = {
      condominiumName: 'Sunset Towers',
      taxId: '12.345.678/0001-90',
      totalUnits: 48,
      propertyType: 'condominio'
    };

    it('should set isSubmitting to true when submitting', () => {
      mockPropertyService.registerProperty.and.returnValue(of({ success: true, property: {
        id: 'prop-1',
        name: 'Sunset Towers',
        taxId: '12.345.678/0001-90',
        totalUnits: 48,
        propertyType: 'condominio',
        adminId: 'admin-1',
        status: PropertyStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }}));

      component.handleSubmit(testData);
      expect(component.isSubmitting).toBe(true);
    });

    it('should clear generalError when submitting', () => {
      component.generalError = 'Previous error';
      mockPropertyService.registerProperty.and.returnValue(of({ success: true, property: {
        id: 'prop-1',
        name: 'Sunset Towers',
        taxId: '12.345.678/0001-90',
        totalUnits: 48,
        propertyType: 'condominio',
        adminId: 'admin-1',
        status: PropertyStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }}));

      component.handleSubmit(testData);
      expect(component.generalError).toBe('');
    });

    it('should call propertyService.registerProperty with correct data', () => {
      mockPropertyService.registerProperty.and.returnValue(of({ success: true }));

      component.handleSubmit(testData);

      expect(mockPropertyService.registerProperty).toHaveBeenCalledWith({
        name: 'Sunset Towers',
        taxId: '12.345.678/0001-90',
        totalUnits: 48,
        propertyType: 'condominio'
      });
    });

    it('should navigate to completion screen on successful registration', () => {
      mockPropertyService.registerProperty.and.returnValue(of({ 
        success: true,
        property: {
          id: 'prop-1',
          name: 'Sunset Towers',
          taxId: '12.345.678/0001-90',
          totalUnits: 48,
          propertyType: 'condominio',
          adminId: 'admin-1',
          status: PropertyStatus.ACTIVE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }));

      component.handleSubmit(testData);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/onboarding/complete']);
    });

    it('should set generalError on failed registration', () => {
      mockPropertyService.registerProperty.and.returnValue(of({ 
        success: false,
        error: 'Registration failed'
      }));

      component.handleSubmit(testData);

      expect(component.generalError).toBe('Registration failed');
      expect(component.isSubmitting).toBe(false);
    });

    it('should handle 409 conflict error', () => {
      mockPropertyService.registerProperty.and.returnValue(
        throwError(() => ({ status: 409, error: { message: 'This Tax ID is already registered.' } }))
      );

      component.handleSubmit(testData);

      expect(component.generalError).toBe('This Tax ID is already registered.');
      expect(component.isSubmitting).toBe(false);
    });

    it('should handle network error', () => {
      mockPropertyService.registerProperty.and.returnValue(
        throwError(() => ({ status: 0 }))
      );

      component.handleSubmit(testData);

      expect(component.generalError).toBe('Unable to connect. Please check your internet connection and try again.');
      expect(component.isSubmitting).toBe(false);
    });

    it('should handle 500 server error', () => {
      mockPropertyService.registerProperty.and.returnValue(
        throwError(() => ({ status: 500 }))
      );

      component.handleSubmit(testData);

      expect(component.generalError).toBe('Something went wrong on our end. Please try again later.');
      expect(component.isSubmitting).toBe(false);
    });
  });

  it('should display page title', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('.page-title');
    expect(title.textContent).toBe('New Condominium');
  });

  it('should display page subtitle', () => {
    const compiled = fixture.nativeElement;
    const subtitle = compiled.querySelector('.page-subtitle');
    expect(subtitle.textContent).toBe('Register a new property to manage');
  });

  it('should display back button', () => {
    const compiled = fixture.nativeElement;
    const backButton = compiled.querySelector('.back-button');
    expect(backButton).toBeTruthy();
  });

  it('should call handleBack when back button is clicked', () => {
    spyOn(component, 'handleBack');
    const compiled = fixture.nativeElement;
    const backButton = compiled.querySelector('.back-button');
    
    backButton.click();
    
    expect(component.handleBack).toHaveBeenCalled();
  });

  it('should display error message when generalError is set', () => {
    component.generalError = 'Test error message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorMessage = compiled.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent.trim()).toBe('Test error message');
  });

  it('should not display error message when generalError is empty', () => {
    component.generalError = '';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorMessage = compiled.querySelector('.error-message');
    expect(errorMessage).toBeFalsy();
  });
});
