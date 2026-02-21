import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminProfileService } from '../services/admin-profile.service';

/**
 * Guard to check profile completion state and redirect accordingly
 * 
 * Rules:
 * - If accessing /admin/profile-setup and profile is complete → redirect to /admin/property-registration
 * - If accessing /admin/property-registration and profile is incomplete → redirect to /admin/profile-setup
 */
export const profileCompletionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const adminProfileService = inject(AdminProfileService);
  const router = inject(Router);

  return adminProfileService.isProfileComplete().pipe(
    map(isComplete => {
      const currentPath = state.url;

      // If accessing profile-setup and profile is already complete, redirect to property registration
      if (currentPath.includes('/admin/profile-setup') && isComplete) {
        return router.createUrlTree(['/admin/property-registration']);
      }

      // If accessing property-registration and profile is not complete, redirect to profile setup
      if (currentPath.includes('/admin/property-registration') && !isComplete) {
        return router.createUrlTree(['/admin/profile-setup']);
      }

      // Allow navigation
      return true;
    })
  );
};
