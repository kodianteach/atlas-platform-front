/**
 * Storage Adapter - Implements StorageGateway using localStorage
 */
import { Injectable } from '@angular/core';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';

@Injectable({ providedIn: 'root' })
export class StorageAdapter extends StorageGateway {
  private readonly storage: Storage;

  constructor() {
    super();
    this.storage = window.localStorage;
  }

  /**
   * Store an item in local storage
   * @param key - Storage key
   * @param value - Value to store (will be JSON serialized)
   */
  override setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      this.storage.setItem(key, serialized);
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'QuotaExceededError') {
          throw new Error('Storage quota exceeded. Please clear some data and try again.');
        }
        if (error.name === 'SecurityError') {
          throw new Error('Storage access denied. Please check your browser settings.');
        }
      }
      throw error;
    }
  }

  /**
   * Retrieve an item from local storage
   * @param key - Storage key
   * @returns Parsed value or null if key doesn't exist
   */
  override getItem<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  /**
   * Remove an item from local storage
   * @param key - Storage key to remove
   */
  override removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch {
      // Silently fail - storage operation not critical
    }
  }

  /**
   * Clear all items from local storage
   */
  override clear(): void {
    try {
      this.storage.clear();
    } catch {
      // Silently fail - storage operation not critical
    }
  }
}
