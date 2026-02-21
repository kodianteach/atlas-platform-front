import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ProfileSetupPageComponent } from './profile-setup-page.component';
import { AdminProfileService } from '../../../services/admin-profile.service';

describe('ProfileSetupPageComponent', () => {
  let component: ProfileSetupPageComponent;
  let fixture: ComponentFixture<ProfileSetupPageComponent>;
  let mockAdminProfileService: jasmine.SpyObj<AdminProfileService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAdminProfileService = jasmine.createSpyObj('AdminProfileService', ['isProfileComplete', 'saveProfile']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    // Default mock behavior
    mockAdminProfileService.isProfileComplete.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [ProfileSetupPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AdminProfileService, useValue: mockAdminProfileService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSetupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isSubmitting as false', () => {
    expect(component.isSubmitting).toBe(false);
  });

  it('should display the page title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.page-title');
    expect(title?.textContent).toContain('Profile Setup');
  });

  it('should display the back button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('.back-button');
    expect(backButton).toBeTruthy();
  });

  it('should call handleBack when back button is clicked', () => {
    spyOn(component, 'handleBack');
    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('.back-button') as HTMLButtonElement;
    backButton.click();
    expect(component.handleBack).toHaveBeenCalled();
  });

  it('should have proper ARIA label on back button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('.back-button');
    expect(backButton?.getAttribute('aria-label')).toBe('Go back');
  });
});
