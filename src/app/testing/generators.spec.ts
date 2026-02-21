import * as fc from 'fast-check';
import {
  firstNameArbitrary,
  lastNameArbitrary,
  idDocumentArbitrary,
  entryTypeArbitrary,
  licensePlateArbitrary,
  validityPeriodArbitrary,
  authorizationFormValueArbitrary,
  authorizationRecordArbitrary,
  invalidFormValueArbitrary,
  authorizationRecordArrayArbitrary,
  runPropertyTest,
} from './generators';

describe('Property Test Generators', () => {
  describe('Basic Generators', () => {
    it('should generate valid first names', () => {
      runPropertyTest(firstNameArbitrary(), (firstName) => {
        expect(firstName.length).toBeGreaterThanOrEqual(2);
        expect(firstName.length).toBeLessThanOrEqual(50);
        expect(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(firstName)).toBe(true);
      });
    });

    it('should generate valid last names', () => {
      runPropertyTest(lastNameArbitrary(), (lastName) => {
        expect(lastName.length).toBeGreaterThanOrEqual(2);
        expect(lastName.length).toBeLessThanOrEqual(50);
        expect(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName)).toBe(true);
      });
    });

    it('should generate valid ID documents', () => {
      runPropertyTest(idDocumentArbitrary(), (idDocument) => {
        expect(idDocument.length).toBeGreaterThanOrEqual(5);
        expect(idDocument.length).toBeLessThanOrEqual(20);
        expect(/^[a-zA-Z0-9]+$/.test(idDocument)).toBe(true);
      });
    });

    it('should generate valid entry types', () => {
      runPropertyTest(entryTypeArbitrary(), (entryType) => {
        expect(['visitor', 'courier']).toContain(entryType);
      });
    });

    it('should generate valid license plates', () => {
      runPropertyTest(licensePlateArbitrary(), (licensePlate) => {
        expect(licensePlate.length).toBeGreaterThanOrEqual(6);
        expect(licensePlate.length).toBeLessThanOrEqual(10);
        expect(/^[A-Z0-9]{3}-?[A-Z0-9]{3,4}$/.test(licensePlate)).toBe(true);
      });
    });

    it('should generate valid validity periods', () => {
      runPropertyTest(validityPeriodArbitrary(), (validityPeriod) => {
        expect([60, 120, 240, 480, 1440]).toContain(validityPeriod);
      });
    });
  });

  describe('AuthorizationFormValue Generator', () => {
    it('should generate valid form values with required fields', () => {
      runPropertyTest(authorizationFormValueArbitrary(), (formValue) => {
        expect(formValue.firstName).toBeDefined();
        expect(formValue.lastName).toBeDefined();
        expect(formValue.idDocument).toBeDefined();
        expect(formValue.entryType).toBeDefined();
        expect(typeof formValue.hasVehicle).toBe('boolean');
        expect(formValue.validityPeriod).toBeDefined();
      });
    });

    it('should include license plate when hasVehicle is true', () => {
      runPropertyTest(authorizationFormValueArbitrary(), (formValue) => {
        if (formValue.hasVehicle) {
          expect(formValue.licensePlate).toBeDefined();
          expect(formValue.licensePlate!.length).toBeGreaterThan(0);
        }
      });
    });

    it('should include courier fields when entryType is courier', () => {
      runPropertyTest(authorizationFormValueArbitrary(), (formValue) => {
        if (formValue.entryType === 'courier') {
          expect(formValue.orderOrigin).toBeDefined();
          expect(formValue.orderType).toBeDefined();
        }
      });
    });
  });

  describe('AuthorizationRecord Generator', () => {
    it('should generate valid authorization records', () => {
      runPropertyTest(authorizationRecordArbitrary(), (record) => {
        expect(record.id).toBeDefined();
        expect(record.firstName).toBeDefined();
        expect(record.lastName).toBeDefined();
        expect(record.idDocument).toBeDefined();
        expect(record.entryType).toBeDefined();
        expect(typeof record.hasVehicle).toBe('boolean');
        expect(record.validityPeriod).toBeDefined();
        expect(record.createdAt).toBeInstanceOf(Date);
        expect(record.expiresAt).toBeInstanceOf(Date);
      });
    });

    it('should calculate expiresAt correctly', () => {
      runPropertyTest(authorizationRecordArbitrary(), (record) => {
        const expectedExpiresAt = new Date(
          record.createdAt.getTime() + record.validityPeriod * 60 * 1000
        );
        expect(record.expiresAt.getTime()).toBe(expectedExpiresAt.getTime());
      });
    });

    it('should include license plate when hasVehicle is true', () => {
      runPropertyTest(authorizationRecordArbitrary(), (record) => {
        if (record.hasVehicle) {
          expect(record.licensePlate).toBeDefined();
        }
      });
    });

    it('should include courier fields when entryType is courier', () => {
      runPropertyTest(authorizationRecordArbitrary(), (record) => {
        if (record.entryType === 'courier') {
          expect(record.orderOrigin).toBeDefined();
          expect(record.orderType).toBeDefined();
        }
      });
    });
  });

  describe('Invalid Form Value Generator', () => {
    it('should generate form values with at least one empty mandatory field', () => {
      runPropertyTest(invalidFormValueArbitrary(), (formValue) => {
        const hasEmptyField =
          formValue.firstName === '' ||
          formValue.lastName === '' ||
          formValue.idDocument === '';
        expect(hasEmptyField).toBe(true);
      });
    });
  });

  describe('Authorization Record Array Generator', () => {
    it('should generate arrays within specified length bounds', () => {
      runPropertyTest(authorizationRecordArrayArbitrary(5, 10), (records) => {
        expect(records.length).toBeGreaterThanOrEqual(5);
        expect(records.length).toBeLessThanOrEqual(10);
      });
    });

    it('should generate arrays with valid records', () => {
      runPropertyTest(authorizationRecordArrayArbitrary(1, 5), (records) => {
        records.forEach((record) => {
          expect(record.id).toBeDefined();
          expect(record.firstName).toBeDefined();
          expect(record.createdAt).toBeInstanceOf(Date);
        });
      });
    });
  });
});
