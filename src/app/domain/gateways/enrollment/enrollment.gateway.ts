import { Observable } from 'rxjs';
import { EnrollmentTokenValidation, EnrollDeviceRequest, EnrollmentResult } from '@domain/models/enrollment/enrollment.model';
import { Result } from '@domain/models/common/api-response.model';

/**
 * Gateway abstracto para operaciones de enrolamiento de dispositivos de portería.
 * Los adaptadores de infraestructura deben implementar este gateway.
 */
export abstract class EnrollmentGateway {
  /**
   * Valida un token de enrolamiento sin consumirlo.
   * @param token Token raw del enlace de enrolamiento
   */
  abstract validateToken(token: string): Observable<Result<EnrollmentTokenValidation>>;

  /**
   * Enrola el dispositivo consumiendo el token.
   * Retorna la clave pública JWK para verificación offline de QRs.
   * @param request Datos del dispositivo y token
   */
  abstract enrollDevice(request: EnrollDeviceRequest): Observable<Result<EnrollmentResult>>;
}
