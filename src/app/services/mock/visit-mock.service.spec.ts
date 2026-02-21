import { TestBed } from '@angular/core/testing';
import { VisitMockService } from './visit-mock.service';
import { VisitStatus } from './types/entities.interface';

describe('VisitMockService', () => {
  let service: VisitMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [VisitMockService] });
    service = TestBed.inject(VisitMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create visit with unique identifier', (done) => {
    const request = { visitorName: 'John Doe', visitorDocument: 'ID-123', unitId: 'unit-1', scheduledDate: '2024-03-01T10:00:00Z' };
    service.createVisit(request).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data!.status).toBe(VisitStatus.PENDING);
      done();
    });
  });

  it('should approve visit', (done) => {
    service.approveVisit('visit-2').subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data!.status).toBe(VisitStatus.APPROVED);
      done();
    });
  });
});
