/**
 * Porter Guard - Protects doorman/porter routes.
 * Verifies user has porter role (PORTERO_GENERAL, PORTERO_DELIVERY, or SECURITY).
 * Redirects to /login if no valid token or role.
 */
import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';

export const porterGuard: CanActivateFn = (): boolean | UrlTree => {
  const storage = inject(StorageGateway);
  const router = inject(Router);

  const token = storage.getItem<string>('auth_token');
  if (!token || token.length === 0) {
    return router.createUrlTree(['/login']);
  }

  // Decode JWT payload to check roles
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const roles: string[] = payload.roles || payload.role || [];
    const rolesArray = Array.isArray(roles) ? roles : [roles];

    const porterRoles = new Set(['PORTERO_GENERAL', 'PORTERO_DELIVERY', 'SECURITY']);
    const hasPorterRole = rolesArray.some(role => porterRoles.has(role));

    if (hasPorterRole) {
      return true;
    }
  } catch {
    // Invalid token format
  }

  return router.createUrlTree(['/login']);
};
