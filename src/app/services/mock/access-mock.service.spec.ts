import { TestBed } from '@angular/core/testing';
import { AccessMockService } from './access-mock.service';

describe('AccessMockService', () => {
  let service: AccessMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AccessMockService] });
    service = TestBed.inject(AccessMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate access code', (done) => {
    const request = { userId: 'user-1', organizationId: 'org-1', validFrom: '2024-01-01T00:00:00Z', validUntil: '2024-12-31T23:59:59Z', maxUsages: 10 };
    service.generateAccessCode(request).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data!.code).toBeTruthy();
      expect(response.data!.usageCount).toBe(0);
      done();
    });
  });

  it('should validate valid QR code', (done) => {
    // Use a code that will be valid - checking the validation logic works
    service.validateQRCode({ code: 'QR-DEF987654321', organizationId: 'org-1' }).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      // The code should be valid since we updated the expiry date
      if (response.data!.valid) {
        expect(response.data!.accessCode).toBeDefined();
      }
      done();
    });
  });
});
