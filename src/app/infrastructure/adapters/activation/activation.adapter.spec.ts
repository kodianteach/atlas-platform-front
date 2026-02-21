import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivationAdapter } from './activation.adapter';
import { ActivateRequest } from '@domain/models/activation/activation.model';
import { environment } from '@env/environment';

describe('ActivationAdapter', () => {
  let adapter: ActivationAdapter;
  let httpMock: HttpTestingController;

  const BASE_URL = `${environment.apiUrl}/external/admin`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActivationAdapter]
    });

    adapter = TestBed.inject(ActivationAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('validateToken', () => {
    it('should return success with VALID token', (done) => {
      adapter.validateToken('valid-token').subscribe(result => {
        expect(result.success).toBeTrue();
        if (result.success) {
          expect(result.data.valid).toBeTrue();
          expect(result.data.status).toBe('VALID');
          expect(result.data.email).toBe('admin@test.com');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=valid-token`);
      expect(req.request.method).toBe('GET');
      req.flush({ valid: true, status: 'VALID', email: 'admin@test.com' });
    });

    it('should return INVALID status on 400 error', (done) => {
      adapter.validateToken('bad-token').subscribe(result => {
        expect(result.success).toBeTrue();
        if (result.success) {
          expect(result.data.valid).toBeFalse();
          expect(result.data.status).toBe('INVALID');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=bad-token`);
      req.flush({ message: 'Invalid token' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should return EXPIRED status on 410 error', (done) => {
      adapter.validateToken('expired-token').subscribe(result => {
        expect(result.success).toBeTrue();
        if (result.success) {
          expect(result.data.valid).toBeFalse();
          expect(result.data.status).toBe('EXPIRED');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=expired-token`);
      req.flush({ message: 'Token expired' }, { status: 410, statusText: 'Gone' });
    });

    it('should return failure on network error', (done) => {
      adapter.validateToken('any-token').subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('NETWORK_ERROR');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/validate-token?token=any-token`);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    });
  });

  describe('activate', () => {
    const mockRequest: ActivateRequest = {
      token: 'valid-token',
      email: 'admin@test.com',
      currentPassword: 'TempPass1',
      newPassword: 'NewPass123'
    };

    it('should return success when activation succeeds', (done) => {
      adapter.activate(mockRequest).subscribe(result => {
        expect(result.success).toBeTrue();
        if (result.success) {
          expect(result.data.activated).toBeTrue();
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/activate`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush({ activated: true, message: 'Account activated' });
    });

    it('should return INVALID_CREDENTIALS on 401 error', (done) => {
      adapter.activate(mockRequest).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('INVALID_CREDENTIALS');
          expect(result.error.message).toContain('credenciales temporales');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/activate`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should return ALREADY_ACTIVATED on 409 error', (done) => {
      adapter.activate(mockRequest).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('ALREADY_ACTIVATED');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/activate`);
      req.flush({ message: 'Already activated' }, { status: 409, statusText: 'Conflict' });
    });

    it('should return VALIDATION_ERROR on 400 with backend message', (done) => {
      adapter.activate(mockRequest).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('VALIDATION_ERROR');
          expect(result.error.message).toBe('Password too weak');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/activate`);
      req.flush({ message: 'Password too weak' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should return failure on server error', (done) => {
      adapter.activate(mockRequest).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('UNKNOWN_ERROR');
        }
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/activate`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
