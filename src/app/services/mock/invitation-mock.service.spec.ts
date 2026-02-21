import { TestBed } from '@angular/core/testing';
import { InvitationMockService } from './invitation-mock.service';
import { InvitationStatus } from './types/entities.interface';

describe('InvitationMockService', () => {
  let service: InvitationMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InvitationMockService] });
    service = TestBed.inject(InvitationMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create invitation with unique code', (done) => {
    const request = { email: 'test@example.com', organizationId: 'org-1', expiresAt: '2024-12-31T23:59:59Z' };
    service.createInvitation(request).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data!.code).toBeTruthy();
      expect(response.data!.status).toBe(InvitationStatus.PENDING);
      done();
    });
  });

  it('should accept invitation', (done) => {
    service.acceptInvitation('invitation-1').subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data!.status).toBe(InvitationStatus.ACCEPTED);
      done();
    });
  });
});
