/**
 * Enrollment Domain Models
 * Models for the porter device enrollment flow (HU #5)
 */

/**
 * Result from validating an enrollment token (without consuming it).
 * Maps to backend: ValidateEnrollmentTokenUseCase.TokenValidationResult
 */
export interface EnrollmentTokenValidation {
  valid: boolean;
  porterId: number;
  porterName: string;
  organizationName: string;
  expiresAt: string;
}

/**
 * Request payload sent to the enrollment endpoint.
 * Maps to backend: EnrollDeviceRequest
 */
export interface EnrollDeviceRequest {
  token: string;
  platform: string;
  model: string;
  appVersion: string;
}

/**
 * Result of a successful enrollment.
 * Contains the verification key to store locally for offline QR validation.
 * Maps to backend: EnrollDeviceResponse
 */
export interface EnrollmentResult {
  porterId: number;
  porterDisplayName: string;
  organizationName: string;
  /** Ed25519 public key in JWK format for offline QR verification */
  verificationKeyJwk: string;
  /** Key Identifier (kid) */
  keyId: string;
  /** Maximum clock skew in minutes for offline validation */
  maxClockSkewMinutes: number;
  /** JWT access token for automatic porter session */
  accessToken?: string;
  /** JWT refresh token */
  refreshToken?: string;
  /** Default route for the porter */
  defaultRoute?: string;
  /** Username generado para futuros inicios de sesión */
  porterUsername?: string;
  /** Contraseña generada para futuros inicios de sesión (solo se muestra una vez) */
  porterPassword?: string;
}
