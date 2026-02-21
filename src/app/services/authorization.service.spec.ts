import { TestBed } from '@angular/core/testing';
import { AuthorizationService } from './authorization.service';
import { Authorization } from '../models/authorization.model';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAuthorizations', () => {
    it('should return an observable of authorizations', (done) => {
      service.getAuthorizations().subscribe(auths => {
        expect(Array.isArray(auths)).toBe(true);
        expect(auths.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should return authorizations with required properties', (done) => {
      service.getAuthorizations().subscribe(auths => {
        const auth = auths[0];
        expect(auth.id).toBeDefined();
        expect(auth.name).toBeDefined();
        expect(auth.type).toBeDefined();
        expect(auth.isActive).toBeDefined();
        expect(auth.icon).toBeDefined();
        expect(auth.details).toBeDefined();
        expect(auth.createdAt).toBeDefined();
        expect(auth.updatedAt).toBeDefined();
        done();
      });
    });
  });

  describe('getActiveCount', () => {
    it('should return count of active authorizations', (done) => {
      service.getActiveCount().subscribe(count => {
        expect(typeof count).toBe('number');
        expect(count).toBeGreaterThanOrEqual(0);
        done();
      });
    });

    it('should update count when authorization status changes', (done) => {
      let callCount = 0;
      let initialCount: number;
      
      const subscription = service.getActiveCount().subscribe(count => {
        callCount++;
        if (callCount === 1) {
          initialCount = count;
          // Get first authorization and toggle it
          service.getAuthorizations().subscribe(auths => {
            if (auths.length > 0) {
              service.toggleAuthorizationStatus(auths[0].id).subscribe();
            }
          });
        } else if (callCount === 2) {
          // After toggle, count should change
          expect(count).not.toBe(initialCount);
          subscription.unsubscribe();
          done();
        }
      });
    });
  });

  describe('toggleAuthorizationStatus', () => {
    it('should toggle isActive from true to false', (done) => {
      service.getAuthorizations().subscribe({
        next: (auths) => {
          const activeAuth = auths.find(a => a.isActive);
          if (activeAuth) {
            service.toggleAuthorizationStatus(activeAuth.id).subscribe({
              next: (updated) => {
                expect(updated.isActive).toBe(false);
                expect(updated.id).toBe(activeAuth.id);
                done();
              },
              error: (err) => {
                fail('Toggle should not error: ' + err);
                done();
              }
            });
          } else {
            done();
          }
        },
        error: (err) => {
          fail('Get authorizations should not error: ' + err);
          done();
        }
      });
    });

    it('should toggle isActive from false to true', (done) => {
      service.getAuthorizations().subscribe({
        next: (auths) => {
          const inactiveAuth = auths.find(a => !a.isActive);
          if (inactiveAuth) {
            service.toggleAuthorizationStatus(inactiveAuth.id).subscribe({
              next: (updated) => {
                expect(updated.isActive).toBe(true);
                expect(updated.id).toBe(inactiveAuth.id);
                done();
              },
              error: (err) => {
                fail('Toggle should not error: ' + err);
                done();
              }
            });
          } else {
            done();
          }
        },
        error: (err) => {
          fail('Get authorizations should not error: ' + err);
          done();
        }
      });
    });

    it('should update the updatedAt timestamp', (done) => {
      service.getAuthorizations().subscribe({
        next: (auths) => {
          if (auths.length > 0) {
            const originalUpdatedAt = auths[0].updatedAt;
            service.toggleAuthorizationStatus(auths[0].id).subscribe({
              next: (updated) => {
                expect(updated.updatedAt.getTime()).not.toBe(originalUpdatedAt.getTime());
                done();
              },
              error: (err) => {
                fail('Toggle should not error: ' + err);
                done();
              }
            });
          } else {
            done();
          }
        },
        error: (err) => {
          fail('Get authorizations should not error: ' + err);
          done();
        }
      });
    });

    it('should return error for non-existent authorization', (done) => {
      service.toggleAuthorizationStatus('non-existent-id').subscribe({
        next: () => fail('Should have thrown an error'),
        error: (error) => {
          expect(error.message).toContain('not found');
          done();
        }
      });
    });

    it('should persist the change in the authorizations stream', (done) => {
      let authId: string;
      let originalStatus: boolean;
      let callCount = 0;

      const subscription = service.getAuthorizations().subscribe(auths => {
        callCount++;
        if (callCount === 1 && auths.length > 0) {
          authId = auths[0].id;
          originalStatus = auths[0].isActive;
          
          service.toggleAuthorizationStatus(authId).subscribe();
        } else if (callCount === 2) {
          // Check that the change persisted
          const updatedAuth = auths.find(a => a.id === authId);
          expect(updatedAuth?.isActive).toBe(!originalStatus);
          subscription.unsubscribe();
          done();
        }
      });
    });
  });

  describe('addAuthorization', () => {
    it('should add a new authorization to the list', (done) => {
      const newAuth: Authorization = {
        id: 'test-id',
        name: 'Test Authorization',
        type: 'permanent',
        isActive: true,
        icon: 'test-icon',
        details: {
          accessType: 'Permanent Access',
          permissions: 'Full Permissions'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      let initialCount: number;

      service.getAuthorizations().subscribe(auths => {
        if (initialCount === undefined) {
          initialCount = auths.length;
          service.addAuthorization(newAuth).subscribe();
        } else {
          expect(auths.length).toBe(initialCount + 1);
          const added = auths.find(a => a.id === 'test-id');
          expect(added).toBeDefined();
          expect(added?.name).toBe('Test Authorization');
          done();
        }
      });
    });

    it('should set createdAt and updatedAt timestamps', (done) => {
      const newAuth: Authorization = {
        id: 'test-id-2',
        name: 'Test Authorization 2',
        type: 'scheduled',
        isActive: true,
        icon: 'test-icon',
        details: {
          schedule: {
            days: ['Mon'],
            timeRange: '09:00 AM - 05:00 PM'
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.addAuthorization(newAuth).subscribe(added => {
        expect(added.createdAt).toBeDefined();
        expect(added.updatedAt).toBeDefined();
        expect(added.createdAt instanceof Date).toBe(true);
        expect(added.updatedAt instanceof Date).toBe(true);
        done();
      });
    });
  });
});
