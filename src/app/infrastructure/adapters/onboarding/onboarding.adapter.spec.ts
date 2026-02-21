import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OnboardingAdapter } from './onboarding.adapter';
import { OnboardingRequest, OrganizationType } from '@domain/models/onboarding/onboarding.model';
import { environment } from '@env/environment';

describe('OnboardingAdapter', () => {
  let adapter: OnboardingAdapter;
  let httpMock: HttpTestingController;

  const ENDPOINT = `${environment.apiUrl}/external/admin/complete-onboarding`;

  const mockRequest: OnboardingRequest = {
    organizationName: 'Conjunto Test',
    address: 'Calle 1 #2-3',
    nit: '900123456-1',
    phone: '3001234567',
    organizationType: OrganizationType.CONJUNTO
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OnboardingAdapter]
    });

    adapter = TestBed.inject(OnboardingAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return success when onboarding completes', (done) => {
    adapter.completeOnboarding(mockRequest).subscribe(result => {
      expect(result.success).toBeTrue();
      if (result.success) {
        expect(result.data.completed).toBeTrue();
        expect(result.data.organizationId).toBe('org-123');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush({ completed: true, organizationId: 'org-123', message: 'Success' });
  });

  it('should return VALIDATION_ERROR on 400', (done) => {
    adapter.completeOnboarding(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    req.flush({ message: 'Invalid NIT' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should return UNAUTHORIZED on 401', (done) => {
    adapter.completeOnboarding(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('UNAUTHORIZED');
        expect(result.error.message).toContain('Sesión expirada');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    req.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('should return DUPLICATE_ERROR on 409 with backend message', (done) => {
    adapter.completeOnboarding(mockRequest).subscribe(result => {
      expect(result.success).toBeFalse();
      if (!result.success) {
        expect(result.error.code).toBe('DUPLICATE_ERROR');
        expect(result.error.message).toBe('NIT duplicado');
      }
      done();
    });

    const req = httpMock.expectOne(ENDPOINT);
    req.flush({ message: 'NIT duplicado' }, { status: 409, statusText: 'Conflict' });
  });

  it('should return failure on network error', (done) => {
    adapter.completeOnboarding(mockRequest).subscribe(result => {
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
    adapter.completeOnboarding(mockRequest).subscribe(result => {
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
