/**
 * Profile Completion Guard
 * Redirects based on profile completion state
 *
 * Rules:
 * - If accessing /admin/profile-setup and profile is complete → redirect to /admin/property-registration
 * - If accessing /admin/property-registration and profile is incomplete → redirect to /admin/profile-setup
 */
import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminGateway } from '@domain/gateways/admin/admin.gateway';

export const profileCompletionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | boolean | UrlTree => {
  const adminGateway = inject(AdminGateway);
  const router = inject(Router);
  const currentPath = state.url;
  const isComplete = adminGateway.isProfileComplete();

  if (currentPath.includes('/admin/profile-setup') && isComplete) {
    return router.createUrlTree(['/admin/property-registration']);
  }

  if (currentPath.includes('/admin/property-registration') && !isComplete) {
    return router.createUrlTree(['/admin/profile-setup']);
  }

  return true;
};
