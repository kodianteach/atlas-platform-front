import { 
  generateAuthorization, 
  generateAuthorizationList, 
  generateSchedule,
  authorizationWithActiveStateArbitrary,
  authorizationWithTypeArbitrary,
  runPropertyTest
} from './generators';
import * as fc from 'fast-check';

describe('Access Permissions Generators', () => {
  describe('generateAuthorization', () => {
    it('should generate valid Authorization objects', () => {
      runPropertyTest(generateAuthorization(), (auth) => {
        expect(auth).toBeDefined();
        expect(auth.id).toBeDefined();
        expect(auth.name).toBeDefined();
        expect(auth.name.length).toBeGreaterThanOrEqual(2);
        expect(auth.name.length).toBeLessThanOrEqual(50);
        expect(['permanent', 'scheduled']).toContain(auth.type);
        expect(typeof auth.isActive).toBe('boolean');
        expect(auth.icon).toBeDefined();
        expect(auth.details).toBeDefined();
        expect(auth.createdAt).toBeInstanceOf(Date);
        expect(auth.updatedAt).toBeInstanceOf(Date);
      });
    });

    it('should generate permanent authorizations with correct details', () => {
      runPropertyTest(authorizationWithTypeArbitrary('permanent'), (auth) => {
        expect(auth.type).toBe('permanent');
        expect(auth.details.accessType).toBe('Permanent Access');
        expect(auth.details.permissions).toBe('Full Permissions');
        expect(auth.details.schedule).toBeUndefined();
      });
    });

    it('should generate scheduled authorizations with correct details', () => {
      runPropertyTest(authorizationWithTypeArbitrary('scheduled'), (auth) => {
        expect(auth.type).toBe('scheduled');
        expect(auth.details.schedule).toBeDefined();
        expect(auth.details.schedule!.days).toBeDefined();
        expect(auth.details.schedule!.days.length).toBeGreaterThanOrEqual(1);
        expect(auth.details.schedule!.days.length).toBeLessThanOrEqual(7);
        expect(auth.details.schedule!.timeRange).toBeDefined();
        expect(auth.details.schedule!.timeRange).toMatch(/\d{2}:\d{2} (AM|PM) - \d{2}:\d{2} (AM|PM)/);
      });
    });
  });

  describe('generateAuthorizationList', () => {
    it('should generate arrays of authorizations within specified bounds', () => {
      runPropertyTest(generateAuthorizationList(5, 10), (list) => {
        expect(list.length).toBeGreaterThanOrEqual(5);
        expect(list.length).toBeLessThanOrEqual(10);
        list.forEach(auth => {
          expect(auth.id).toBeDefined();
          expect(['permanent', 'scheduled']).toContain(auth.type);
        });
      });
    });

    it('should generate empty arrays when minLength is 0', () => {
      fc.assert(
        fc.property(generateAuthorizationList(0, 5), (list) => {
          expect(list.length).toBeGreaterThanOrEqual(0);
          expect(list.length).toBeLessThanOrEqual(5);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('generateSchedule', () => {
    it('should generate valid schedule details', () => {
      runPropertyTest(generateSchedule(), (schedule) => {
        expect(schedule.days).toBeDefined();
        expect(schedule.days.length).toBeGreaterThanOrEqual(1);
        expect(schedule.days.length).toBeLessThanOrEqual(7);
        expect(schedule.timeRange).toBeDefined();
        expect(schedule.timeRange).toMatch(/\d{2}:\d{2} (AM|PM) - \d{2}:\d{2} (AM|PM)/);
        
        // Verify all days are valid
        const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        schedule.days.forEach(day => {
          expect(validDays).toContain(day);
        });
        
        // Verify no duplicate days
        const uniqueDays = new Set(schedule.days);
        expect(uniqueDays.size).toBe(schedule.days.length);
      });
    });
  });

  describe('authorizationWithActiveStateArbitrary', () => {
    it('should generate authorizations with specified active state', () => {
      runPropertyTest(authorizationWithActiveStateArbitrary(true), (auth) => {
        expect(auth.isActive).toBe(true);
      });

      runPropertyTest(authorizationWithActiveStateArbitrary(false), (auth) => {
        expect(auth.isActive).toBe(false);
      });
    });
  });
});
