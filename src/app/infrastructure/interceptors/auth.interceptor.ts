import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth Interceptor - Attaches JWT Bearer token to outgoing API requests.
 * Skips auth endpoints (login, activate, register) that don't require authentication.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip token for public endpoints
  const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/activate'];
  const isPublic = publicPaths.some(path => req.url.includes(path));

  if (isPublic) {
    return next(req);
  }

  const raw = localStorage.getItem('auth_token');
  if (!raw) {
    return next(req);
  }

  // Token is stored JSON-stringified (with quotes), so parse it
  let token: string;
  try {
    token = JSON.parse(raw);
  } catch {
    token = raw;
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(cloned);
};
