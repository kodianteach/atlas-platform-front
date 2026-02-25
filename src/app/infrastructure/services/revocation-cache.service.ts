import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'atlas-porter-db';
const DB_VERSION = 2;
const STORE_NAME = 'revoked-authorizations';
const META_STORE = 'sync-metadata';

@Injectable({ providedIn: 'root' })
export class RevocationCacheService {

  private dbPromise: Promise<IDBPDatabase> | null = null;

  private getDb(): Promise<IDBPDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db: IDBPDatabase) {
        if (!db.objectStoreNames.contains('pending-events')) {
          db.createObjectStore('pending-events', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'authId' });
        }
        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: 'key' });
        }
      }
      });
    }
    return this.dbPromise;
  }

  async isRevoked(authId: number): Promise<boolean> {
    try {
      const db = await this.getDb();
      const result = await db.get(STORE_NAME, authId);
      return !!result;
    } catch {
      return false;
    }
  }

  async updateFromServer(revokedIds: number[]): Promise<void> {
    const db = await this.getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    for (const authId of revokedIds) {
      await tx.store.put({ authId, revokedAt: new Date().toISOString() });
    }
    await tx.done;
    await this.setLastSyncTimestamp(new Date().toISOString());
  }

  async getLastSyncTimestamp(): Promise<string | null> {
    try {
      const db = await this.getDb();
      const result = await db.get(META_STORE, 'lastRevocationSync');
      return result?.value ?? null;
    } catch {
      return null;
    }
  }

  async setLastSyncTimestamp(ts: string): Promise<void> {
    const db = await this.getDb();
    await db.put(META_STORE, { key: 'lastRevocationSync', value: ts });
  }
}
