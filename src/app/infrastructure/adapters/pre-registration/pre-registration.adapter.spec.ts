import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PreRegistrationAdapter } from './pre-registration.adapter';
import { PreRegisterRequest, DocumentType } from '@domain/models/pre-registration/pre-registration.model';
import { environment } from '@env/environment';

describe('PreRegistrationAdapter', () => {
  let adapter: PreRegistrationAdapter;
  let httpMock: HttpTestingController;

  const ENDPOINT = `${environment.apiUrl}/external/admin/pre-register`;

  const mockRequest: PreRegisterRequest = {
    fullName: 'Juan Pérez',
    email: 'juan@test.com',
    documentType: DocumentType.CC,
    documentNumber: '1234567890',
    phone: '3001234567'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PreRegistrationAdapter]
    });

    adapter = TestBed.inject(PreRegistrationAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return success when pre-registration succeeds', (done) => {
    adapter.preRegister(mockRequest).subscribe(result => {
      expect(result.success).toBeTrue();
      if (result.success) {
        expect(result.data.registered).toBeTrue();
        expect(result.data.email).toBe('juan@test.com');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush({ registered: true, email: 'juan@test.com', message: 'Success' });
  });

  it('should send X-Operator-Id header', (done) => {
    adapter.preRegister(mockRequest).subscribe(() => done());

    const req = httpMock.expectOne(ENDPOINT);
    expect(req.request.headers.has('X-Operator-Id')).toBeTrue();
    expect(req.request.headers.get('X-Operator-Id')).toBe('atlas-backoffice');
    req.flush({ registered: true, email: 'juan@test.com', message: 'Success' });
  });

  it('should include success message with email in result', (done) => {
    adapter.preRegister(mockRequest).subscribe(result => {
      expect(result.success).toBeTrue();
      if (result.success) {
        expect(result.message).toContain('juan@test.com');
        expect(result.message).toContain('pre-registrado exitosamente');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    req.flush({ registered: true, email: 'juan@test.com', message: 'Success' });
  });

  it('should return DUPLICATE_EMAIL on 409', (done) => {
    adapter.preRegister(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('DUPLICATE_EMAIL');
        expect(result.error.message).toContain('correo electrónico');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    req.flush({ message: 'Email already exists' }, { status: 409, statusText: 'Conflict' });
  });

  it('should return VALIDATION_ERROR on 400 with backend message', (done) => {
    adapter.preRegister(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.message).toBe('Invalid phone number');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    req.flush({ message: 'Invalid phone number' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should return failure on network error', (done) => {
    adapter.preRegister(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('NETWORK_ERROR');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
  });

  it('should return UNKNOWN_ERROR on 500', (done) => {
    adapter.preRegister(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('UNKNOWN_ERROR');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });
});
