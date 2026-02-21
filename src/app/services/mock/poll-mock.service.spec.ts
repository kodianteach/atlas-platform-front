import { TestBed } from '@angular/core/testing';
import { PollMockService } from './poll-mock.service';

describe('PollMockService', () => {
  let service: PollMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PollMockService] });
    service = TestBed.inject(PollMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create poll with options array', (done) => {
    const request = { question: 'Test?', organizationId: 'org-1', expiresAt: '2024-12-31T23:59:59Z', options: ['Yes', 'No'] };
    service.createPoll(request).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data!.options.length).toBe(2);
      expect(response.data!.options[0].voteCount).toBe(0);
      done();
    });
  });

  it('should record vote and update counts', (done) => {
    service.vote({ pollId: 'poll-1', optionId: 'opt-1' }).subscribe(response => {
      expect(response.success).toBe(true);
      const option = response.data!.options.find(o => o.id === 'opt-1');
      expect(option!.voteCount).toBeGreaterThan(45);
      done();
    });
  });
});
