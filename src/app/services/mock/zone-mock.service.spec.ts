import { TestBed } from '@angular/core/testing';
import { ZoneMockService } from './zone-mock.service';

describe('ZoneMockService', () => {
  let service: ZoneMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ZoneMockService] });
    service = TestBed.inject(ZoneMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create zone with boundaries', (done) => {
    const request = { name: 'Test Zone', organizationId: 'org-1', type: 'common', description: 'Test' };
    service.createZone(request).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data!.name).toBe('Test Zone');
      done();
    });
  });

  it('should list zones', (done) => {
    service.listZones().subscribe(response => {
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      done();
    });
  });
});
