import { TestBed } from '@angular/core/testing';
import { ExternalMockService } from './external-mock.service';

describe('ExternalMockService', () => {
  let service: ExternalMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ExternalMockService] });
    service = TestBed.inject(ExternalMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pre-register external admin', (done) => {
    const request = { email: 'admin@example.com', firstName: 'John', lastName: 'Doe', organizationId: 'org-1', role: 'admin' };
    service.preRegister(request).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data!.registrationId).toBeTruthy();
      expect(response.data!.token).toBeTruthy();
      expect(response.data!.status).toBe('PENDING_VERIFICATION');
      done();
    });
  });

  it('should validate external admin token', (done) => {
    service.validateExternalAdmin({ token: 'EXT-ABC123', organizationId: 'org-1' }).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data!.valid).toBe(true);
      done();
    });
  });
});
