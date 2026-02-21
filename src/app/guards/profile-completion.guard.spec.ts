import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { profileCompletionGuard } from './profile-completion.guard';
import { AdminProfileService } from '../services/admin-profile.service';

describe('profileCompletionGuard', () => {
  let mockAdminProfileService: jasmine.SpyObj<AdminProfileService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockAdminProfileService = jasmine.createSpyObj('AdminProfileService', ['isProfileComplete']);
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: AdminProfileService, useValue: mockAdminProfileService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '' } as RouterStateSnapshot;
  });

  it('should allow navigation to profile-setup when profile is not complete', (done) => {
    mockState.url = '/admin/profile-setup';
    mockAdminProfileService.isProfileComplete.and.returnValue(of(false));

    TestBed.runInInjectionContext(() => {
      const result = profileCompletionGuard(mockRoute, mockState);
      
      if (result instanceof Promise || (result as any).subscribe) {
        (result as any).subscribe((value: boolean | UrlTree) => {
          expect(value).toBe(true);
          done();
        });
      }
    });
  });

  it('should redirect to property-registration when accessing profile-setup with complete profile', (done) => {
    mockState.url = '/admin/profile-setup';
    mockAdminProfileService.isProfileComplete.and.returnValue(of(true));
    const urlTree = {} as UrlTree;
    mockRouter.createUrlTree.and.returnValue(urlTree);

    TestBed.runInInjectionContext(() => {
      const result = profileCompletionGuard(mockRoute, mockState);
      
      if (result instanceof Promise || (result as any).subscribe) {
        (result as any).subscribe((value: boolean | UrlTree) => {
          expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/admin/property-registration']);
          expect(value).toBe(urlTree);
          done();
        });
      }
    });
  });

  it('should allow navigation to property-registration when profile is complete', (done) => {
    mockState.url = '/admin/property-registration';
    mockAdminProfileService.isProfileComplete.and.returnValue(of(true));

    TestBed.runInInjectionContext(() => {
      const result = profileCompletionGuard(mockRoute, mockState);
      
      if (result instanceof Promise || (result as any).subscribe) {
        (result as any).subscribe((value: boolean | UrlTree) => {
          expect(value).toBe(true);
          done();
        });
      }
    });
  });

  it('should redirect to profile-setup when accessing property-registration with incomplete profile', (done) => {
    mockState.url = '/admin/property-registration';
    mockAdminProfileService.isProfileComplete.and.returnValue(of(false));
    const urlTree = {} as UrlTree;
    mockRouter.createUrlTree.and.returnValue(urlTree);

    TestBed.runInInjectionContext(() => {
      const result = profileCompletionGuard(mockRoute, mockState);
      
      if (result instanceof Promise || (result as any).subscribe) {
        (result as any).subscribe((value: boolean | UrlTree) => {
          expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/admin/profile-setup']);
          expect(value).toBe(urlTree);
          done();
        });
      }
    });
  });
});
