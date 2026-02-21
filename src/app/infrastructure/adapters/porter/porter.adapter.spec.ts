import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PorterAdapter } from './porter.adapter';
import { CreatePorterRequest, Porter, RegenerateUrlResponse } from '@domain/models/porter/porter.model';
import { environment } from '@env/environment';

describe('PorterAdapter', () => {
  let adapter: PorterAdapter;
  let httpMock: HttpTestingController;
  const ENDPOINT = `${environment.apiUrl}/porters`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PorterAdapter]
    });
    adapter = TestBed.inject(PorterAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('createPorter', () => {
    const request: CreatePorterRequest = {
      displayName: 'Carlos Portería Norte',
      porterType: 'PORTERO_GENERAL'
    };

    it('should return success when porter is created', () => {
      const mockPorter: Porter = {
        id: 1,
        userId: 42,
        organizationId: 100,
        displayName: 'Carlos Portería Norte',
        porterType: 'PORTERO_GENERAL',
        enrollmentUrl: '/porter-enroll?token=abc123'
      };

      adapter.createPorter(request).subscribe(result => {
        expect(result.success).toBeTrue();
        if (result.success) {
          expect(result.data.id).toBe(1);
          expect(result.data.displayName).toBe('Carlos Portería Norte');
          expect(result.data.enrollmentUrl).toBe('/porter-enroll?token=abc123');
        }
      });

      const req = httpMock.expectOne(ENDPOINT);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({ data: mockPorter, message: 'Portero creado exitosamente' });
    });

    it('should return failure on 400 validation error', () => {
      adapter.createPorter(request).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('VALIDATION_ERROR');
        }
      });

      const req = httpMock.expectOne(ENDPOINT);
      req.flush({ message: 'Nombre requerido' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should return failure on network error', () => {
      adapter.createPorter(request).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('NETWORK_ERROR');
        }
      });

      const req = httpMock.expectOne(ENDPOINT);
      req.error(new ProgressEvent('error'));
    });
  });

  describe('listPorters', () => {
    it('should return success with porters list', () => {
      const mockPorters: Porter[] = [
        { id: 1, userId: 42, organizationId: 100, displayName: 'Carlos', porterType: 'PORTERO_GENERAL' },
        { id: 2, userId: 43, organizationId: 100, displayName: 'Ana', porterType: 'PORTERO_DELIVERY' }
      ];

      adapter.listPorters().subscribe(result => {
        expect(result.success).toBeTrue();
        if (result.success) {
          expect(result.data.length).toBe(2);
          expect(result.data[0].displayName).toBe('Carlos');
        }
      });

      const req = httpMock.expectOne(ENDPOINT);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockPorters, message: 'Porteros listados exitosamente' });
    });

    it('should return failure on server error', () => {
      adapter.listPorters().subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('SERVER_ERROR');
        }
      });

      const req = httpMock.expectOne(ENDPOINT);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('regenerateEnrollmentUrl', () => {
    it('should return success with new enrollment URL', () => {
      const mockResponse: RegenerateUrlResponse = {
        porterId: 1,
        enrollmentUrl: '/porter-enroll?token=newtoken123'
      };

      adapter.regenerateEnrollmentUrl(1).subscribe(result => {
        expect(result.success).toBeTrue();
        if (result.success) {
          expect(result.data.enrollmentUrl).toBe('/porter-enroll?token=newtoken123');
        }
      });

      const req = httpMock.expectOne(`${ENDPOINT}/1/regenerate-url`);
      expect(req.request.method).toBe('POST');
      req.flush({ data: mockResponse, message: 'URL regenerada exitosamente' });
    });

    it('should return failure when porter not found', () => {
      adapter.regenerateEnrollmentUrl(999).subscribe(result => {
        expect(result.success).toBeFalse();
        if (!result.success) {
          expect(result.error.code).toBe('NOT_FOUND');
        }
      });

      const req = httpMock.expectOne(`${ENDPOINT}/999/regenerate-url`);
      req.flush({ message: 'Portero no encontrado' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
