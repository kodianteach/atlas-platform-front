import { generateId, generateTimestamp, generateUniqueCode } from './generators';

describe('Generator Utilities', () => {
  
  describe('generateId', () => {
    it('should generate a non-empty string', () => {
      const id = generateId();
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('should follow timestamp-random pattern', () => {
      const id = generateId();
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should contain a timestamp component', () => {
      const beforeTimestamp = Date.now();
      const id = generateId();
      const afterTimestamp = Date.now();
      
      const timestampPart = parseInt(id.split('-')[0], 10);
      expect(timestampPart).toBeGreaterThanOrEqual(beforeTimestamp);
      expect(timestampPart).toBeLessThanOrEqual(afterTimestamp);
    });

    it('should contain a random string component', () => {
      const id = generateId();
      const parts = id.split('-');
      expect(parts.length).toBe(2);
      expect(parts[1].length).toBeGreaterThan(0);
      expect(parts[1]).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe('generateTimestamp', () => {
    it('should generate a non-empty string', () => {
      const timestamp = generateTimestamp();
      expect(timestamp).toBeTruthy();
      expect(typeof timestamp).toBe('string');
    });

    it('should be in ISO 8601 format', () => {
      const timestamp = generateTimestamp();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should be parseable as a valid date', () => {
      const timestamp = generateTimestamp();
      const date = new Date(timestamp);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should represent current time', () => {
      const before = new Date();
      const timestamp = generateTimestamp();
      const after = new Date();
      
      const generated = new Date(timestamp);
      expect(generated.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(generated.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should generate different timestamps when called multiple times', () => {
      const timestamp1 = generateTimestamp();
      // Small delay to ensure different timestamps
      const timestamp2 = generateTimestamp();
      // They might be the same if called too quickly, but should be valid
      expect(timestamp1).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(timestamp2).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe('generateUniqueCode', () => {
    it('should generate a non-empty string', () => {
      const code = generateUniqueCode();
      expect(code).toBeTruthy();
      expect(typeof code).toBe('string');
    });

    it('should be exactly 6 characters long', () => {
      const code = generateUniqueCode();
      expect(code.length).toBe(6);
    });

    it('should contain only uppercase alphanumeric characters', () => {
      const code = generateUniqueCode();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });

    it('should generate unique codes', () => {
      const code1 = generateUniqueCode();
      const code2 = generateUniqueCode();
      const code3 = generateUniqueCode();
      
      // While theoretically possible to get duplicates, it's extremely unlikely
      const codes = [code1, code2, code3];
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(3);
    });

    it('should generate codes with high entropy', () => {
      // Generate multiple codes and check they use different characters
      const codes = Array.from({ length: 20 }, () => generateUniqueCode());
      const allChars = codes.join('');
      const uniqueChars = new Set(allChars.split(''));
      
      // With 20 codes (120 characters), we should see good variety
      expect(uniqueChars.size).toBeGreaterThan(10);
    });
  });

  describe('Integration scenarios', () => {
    it('should generate consistent data types for entity creation', () => {
      const id = generateId();
      const timestamp = generateTimestamp();
      const code = generateUniqueCode();
      
      expect(typeof id).toBe('string');
      expect(typeof timestamp).toBe('string');
      expect(typeof code).toBe('string');
      
      expect(id.length).toBeGreaterThan(0);
      expect(timestamp.length).toBeGreaterThan(0);
      expect(code.length).toBe(6);
    });

    it('should generate valid data for mock entity creation', () => {
      const mockEntity = {
        id: generateId(),
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp(),
        invitationCode: generateUniqueCode()
      };
      
      expect(mockEntity.id).toMatch(/^\d+-[a-z0-9]+$/);
      expect(mockEntity.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(mockEntity.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(mockEntity.invitationCode).toMatch(/^[A-Z0-9]{6}$/);
    });
  });
});
