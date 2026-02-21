import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  /**
   * Store an item in local storage
   * @param key Storage key
   * @param value Value to store (will be JSON serialized)
   * @throws Error if storage quota is exceeded or access is denied
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      this.storage.setItem(key, serialized);
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'QuotaExceededError') {
          throw new Error('Storage quota exceeded. Please clear some data and try again.');
        } else if (error.name === 'SecurityError') {
          throw new Error('Storage access denied. Please check your browser settings.');
        }
      }
      throw error;
    }
  }

  /**
   * Retrieve an item from local storage
   * @param key Storage key
   * @returns Parsed value or null if key doesn't exist
   */
  getItem<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error retrieving item with key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove an item from local storage
   * @param key Storage key to remove
   */
  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item with key "${key}":`, error);
    }
  }

  /**
   * Clear all items from local storage
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
