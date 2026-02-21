/**
 * Authentication credentials for login
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Authenticated user information
 * Extended with multi-tenant JWT fields from the backend
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  /** User account status: PRE_REGISTERED, ACTIVATED, ACTIVE */
  status?: string;
  /** All assigned roles (e.g., ['ADMIN_ATLAS', 'OWNER']) */
  roles?: string[];
  /** Granted permissions for the current tenant */
  permissions?: string[];
  /** Organization ID for multi-tenant isolation */
  organizationId?: string;
  /** Enabled feature modules for the tenant */
  enabledModules?: string[];
  /** Default route after login based on role/status */
  defaultRoute?: string;
}

/**
 * Authentication session data
 */
export interface AuthSession {
  token: string;
  user: AuthUser;
}

/**
 * Authentication response from the backend
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}
