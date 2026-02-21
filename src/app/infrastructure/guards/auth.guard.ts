/**
 * Auth Guard - Protects routes requiring authentication
 * Redirects to /login if user has no valid token
 */
import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const storage = inject(StorageGateway);
  const router = inject(Router);

  const token = storage.getItem<string>('auth_token');

  if (token && token.length > 0) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
