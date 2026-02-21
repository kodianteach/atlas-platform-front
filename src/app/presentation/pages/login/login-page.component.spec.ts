import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { AuthenticationService, AuthResponse } from '../../services/authentication.service';
import { AdminProfileService } from '../../services/admin-profile.service';
import { AdminProfile } from '../../models/admin-profile.model';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let adminProfileService: jasmine.SpyObj<AdminProfileService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['login']);
    const adminProfileServiceSpy = jasmine.createSpyObj('AdminProfileService', ['getProfile']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: AdminProfileService, useValue: adminProfileServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    adminProfileService = TestBed.inject(AdminProfileService) as jasmine.SpyObj<AdminProfileService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Post-login redirect logic', () => {
    it('should redirect admin to profile-setup when profile is not complete', (done) => {
      const authResponse: AuthResponse = {
        success: true,
        token: 'mock-token',
        user: {
          id: 'user-1',
          email: 'admin@atlas.com',
          name: 'Admin User',
          role: 'admin'
        }
      };

      const incompleteProfile: AdminProfile = {
        id: '1',
        userId: 'user-1',
        fullName: '',
        phoneNumber: '',
        adminId: '',
        profileComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      authService.login.and.returnValue(of(authResponse));
      adminProfileService.getProfile.and.returnValue(of(incompleteProfile));

      component.handleLogin({ email: 'admin@atlas.com', password: 'password' });

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/admin/profile-setup']);
        expect(component.isSubmitting).toBe(false);
        done();
      }, 100);
    });

    it('should redirect admin to home when profile is complete', (done) => {
      const authResponse: AuthResponse = {
        success: true,
        token: 'mock-token',
        user: {
          id: 'user-1',
          email: 'admin@atlas.com',
          name: 'Admin User',
          role: 'admin'
        }
      };

      const completeProfile: AdminProfile = {
        id: '1',
        userId: 'user-1',
        fullName: 'Admin User',
        phoneNumber: '+1234567890',
        adminId: 'ADM-001',
        profileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      authService.login.and.returnValue(of(authResponse));
      adminProfileService.getProfile.and.returnValue(of(completeProfile));

      component.handleLogin({ email: 'admin@atlas.com', password: 'password' });

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
        expect(component.isSubmitting).toBe(false);
        done();
      }, 100);
    });

    it('should redirect admin to profile-setup when profile fetch fails', (done) => {
      const authResponse: AuthResponse = {
        success: true,
        token: 'mock-token',
        user: {
          id: 'user-1',
          email: 'admin@atlas.com',
          name: 'Admin User',
          role: 'admin'
        }
      };

      authService.login.and.returnValue(of(authResponse));
      adminProfileService.getProfile.and.returnValue(throwError(() => new Error('Profile fetch failed')));

      component.handleLogin({ email: 'admin@atlas.com', password: 'password' });

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/admin/profile-setup']);
        expect(component.isSubmitting).toBe(false);
        done();
      }, 100);
    });

    it('should redirect non-admin users directly to home', (done) => {
      const authResponse: AuthResponse = {
        success: true,
        token: 'mock-token',
        user: {
          id: 'user-2',
          email: 'resident@atlas.com',
          name: 'Resident User',
          role: 'resident'
        }
      };

      authService.login.and.returnValue(of(authResponse));

      component.handleLogin({ email: 'resident@atlas.com', password: 'password' });

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
        expect(adminProfileService.getProfile).not.toHaveBeenCalled();
        expect(component.isSubmitting).toBe(false);
        done();
      }, 100);
    });

    it('should handle login errors gracefully', (done) => {
      authService.login.and.returnValue(of({
        success: false,
        error: 'Invalid credentials'
      }));

      component.handleLogin({ email: 'wrong@atlas.com', password: 'wrong' });

      setTimeout(() => {
        expect(component.generalError).toBe('Invalid credentials');
        expect(router.navigate).not.toHaveBeenCalled();
        expect(component.isSubmitting).toBe(false);
        done();
      }, 100);
    });
  });
});
