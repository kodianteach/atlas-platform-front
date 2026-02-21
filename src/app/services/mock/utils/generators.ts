/**
 * Utility functions for generating mock data identifiers and timestamps
 */

/**
 * Generates a unique ID using timestamp + random string pattern
 * Format: {timestamp}-{random-string}
 * Example: 1704067200000-a3f9k2m1p
 * 
 * @returns A unique identifier string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates an ISO 8601 formatted timestamp for the current time
 * Format: YYYY-MM-DDTHH:mm:ss.sssZ
 * Example: 2024-01-01T12:00:00.000Z
 * 
 * @returns ISO 8601 formatted timestamp string
 */
export function generateTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Generates a unique invitation code
 * Format: 6 uppercase alphanumeric characters
 * Example: A3F9K2
 * 
 * @returns A unique invitation code string
 */
export function generateUniqueCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
