import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnrollmentAdapter } from './enrollment.adapter';
import { EnrollDeviceRequest } from '@domain/models/enrollment/enrollment.model';
import { environment } from '@env/environment';

describe('EnrollmentAdapter', () => {
  let adapter: EnrollmentAdapter;
  let httpMock: HttpTestingController;

  const BASE_URL = `${environment.apiUrl}/external/porter`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnrollmentAdapter]
    });

    adapter = TestBed.inject(EnrollmentAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('validateToken', () => {
    it('should return success with valid token data', (done) => {
      adapter.validateToken('valid-token-123').subscribe(result => {
        expect(result.success).toBeTrue();
        if (result.success) {
          expect(result.data.valid).toBeTrue();
          expect(result.data.porterName).toBe('Carlos Portería');
          expect(result.data.organizationName).toBe('Conjunto Atlas');
          expect(result.data.expiresAt).toBeDefined();
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=valid-token-123`);
      expect(req.request.method).toBe('GET');
      req.flush({
        success: true,
        status: 200,
        message: 'Token válido',
        data: {
          valid: true,
          porterId: 1,
          porterName: 'Carlos Portería',
          organizationName: 'Conjunto Atlas',
          expiresAt: '2026-02-22T00:00:00Z'
        },
        timestamp: new Date().toISOString()
      });
    });

    it('should return INVALID_TOKEN failure on 400 error', (done) => {
      adapter.validateToken('bad-token').subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('INVALID_TOKEN');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=bad-token`);
      req.flush({ message: 'Token inválido' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should return INVALID_TOKEN failure on 404 error', (done) => {
      adapter.validateToken('unknown-token').subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('INVALID_TOKEN');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=unknown-token`);
      req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should return TOKEN_EXPIRED failure on 410 error', (done) => {
      adapter.validateToken('expired-token').subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('TOKEN_EXPIRED');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=expired-token`);
      req.flush({ message: 'Token expirado' }, { status: 410, statusText: 'Gone' });
    });

    it('should return NETWORK_ERROR failure on network error', (done) => {
      adapter.validateToken('any-token').subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('NETWORK_ERROR');
          expect(result.error.message).toContain('conexión');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=any-token`);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    });

    it('should return UNKNOWN_ERROR failure on 500 error', (done) => {
      adapter.validateToken('any-token').subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('UNKNOWN_ERROR');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=any-token`);
      req.flush({ message: 'Internal error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('enrollDevice', () => {
    const mockRequest: EnrollDeviceRequest = {
      token: 'valid-token-123',
      platform: 'Android',
      model: 'Samsung Galaxy S24',
      appVersion: '1.0.0'
    };

    const mockEnrollmentResult = {
      porterId: 1,
      porterDisplayName: 'Carlos Portería',
      organizationName: 'Conjunto Atlas',
      verificationKeyJwk: '{"kty":"OKP","crv":"Ed25519","x":"testKey123"}',
      keyId: 'key-abc-123',
      maxClockSkewMinutes: 5
    };

    it('should return success with enrollment result', (done) => {
      adapter.enrollDevice(mockRequest).subscribe(result => {
        expect(result.success).toBeTrue();
        if (result.success) {
          expect(result.data.porterId).toBe(1);
          expect(result.data.porterDisplayName).toBe('Carlos Portería');
          expect(result.data.verificationKeyJwk).toContain('Ed25519');
          expect(result.data.keyId).toBe('key-abc-123');
          expect(result.data.maxClockSkewMinutes).toBe(5);
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/enroll`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush({
        success: true,
        status: 200,
        message: 'Dispositivo enrolado exitosamente',
        data: mockEnrollmentResult,
        timestamp: new Date().toISOString()
      });
    });

    it('should return VALIDATION_ERROR on 400 error', (done) => {
      adapter.enrollDevice(mockRequest).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('VALIDATION_ERROR');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/enroll`);
      req.flush({ message: 'Token requerido' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should return ALREADY_ENROLLED on 409 error', (done) => {
      adapter.enrollDevice(mockRequest).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('ALREADY_ENROLLED');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/enroll`);
      req.flush({ message: 'Already enrolled' }, { status: 409, statusText: 'Conflict' });
    });

    it('should return TOKEN_CONSUMED on 410 error', (done) => {
      adapter.enrollDevice(mockRequest).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('TOKEN_CONSUMED');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/enroll`);
      req.flush({ message: 'Token consumed' }, { status: 410, statusText: 'Gone' });
    });

    it('should return NETWORK_ERROR on network failure', (done) => {
      adapter.enrollDevice(mockRequest).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('NETWORK_ERROR');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/enroll`);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    });

    it('should return SERVER_ERROR on 500 error', (done) => {
      adapter.enrollDevice(mockRequest).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('SERVER_ERROR');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/enroll`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
