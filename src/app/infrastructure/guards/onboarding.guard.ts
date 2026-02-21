/**
 * Onboarding Guard - Redirects ADMIN_ATLAS with ACTIVATED status to /onboarding
 * Blocks access to other routes until onboarding is completed.
 *
 * This guard is applied to protected routes (home, etc.) to intercept
 * users who still need to complete onboarding.
 *
 * Logic:
 * - If user has role ADMIN_ATLAS and status ACTIVATED → redirect to /onboarding
 * - Otherwise → allow navigation
 *
 * NOTE: Do NOT apply this guard to the /onboarding route itself (causes infinite redirect).
 */
import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';
import { AuthUser } from '@domain/models/auth/auth.model';

export const onboardingGuard: CanActivateFn = (): boolean | UrlTree => {
  const storage = inject(StorageGateway);
  const router = inject(Router);

  const user = storage.getItem<AuthUser>('auth_user');

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const isAdminAtlas = user.role === 'ADMIN_ATLAS' ||
    (user.roles && user.roles.includes('ADMIN_ATLAS'));

  // If ADMIN_ATLAS has no organizationId, onboarding is still pending
  const needsOnboarding = !user.organizationId;

  if (isAdminAtlas && needsOnboarding) {
    return router.createUrlTree(['/onboarding']);
  }

  return true;
};
