import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth Interceptor - Attaches JWT Bearer token and user context headers to outgoing API requests.
 * Skips auth endpoints (login, activate, register) that don't require authentication.
 *
 * Headers injected:
 *  - Authorization: Bearer <token>
 *  - X-User-Id: numeric user ID from stored auth user
 *  - X-Organization-Id: numeric organization ID from stored auth user
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

  // Build headers: Authorization + user context for backend
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`
  };

  const userRaw = localStorage.getItem('auth_user');
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      if (user.id) {
        headers['X-User-Id'] = String(user.id);
      }
      if (user.organizationId) {
        headers['X-Organization-Id'] = String(user.organizationId);
      }
      if (user.role) {
        headers['X-User-Role'] = String(user.role);
      }
    } catch {
      // ignore parse errors
    }
  }

  const cloned = req.clone({ setHeaders: headers });

  return next(cloned);
};
