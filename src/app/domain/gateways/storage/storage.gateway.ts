/**
 * Storage Gateway - Abstract interface for local storage operations
 */

export abstract class StorageGateway {
  /**
   * Store an item
   * @param key - Storage key
   * @param value - Value to store
   */
  abstract setItem<T>(key: string, value: T): void;

  /**
   * Retrieve an item
   * @param key - Storage key
   */
  abstract getItem<T>(key: string): T | null;

  /**
   * Remove an item
   * @param key - Storage key
   */
  abstract removeItem(key: string): void;

  /**
   * Clear all stored items
   */
  abstract clear(): void;
}
