import { Injectable, signal } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { AccessEvent } from '@domain/models/entry/entry.model';

const DB_NAME = 'atlas-porter-db';
const DB_VERSION = 2;
const STORE_NAME = 'pending-events';

@Injectable({ providedIn: 'root' })
export class OfflineEventQueueService {

  readonly pendingCount = signal(0);

  private dbPromise: Promise<IDBPDatabase> | null = null;

  private getDb(): Promise<IDBPDatabase> {
    this.dbPromise ??= openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('revoked-authorizations')) {
          db.createObjectStore('revoked-authorizations', { keyPath: 'authId' });
        }
        if (!db.objectStoreNames.contains('sync-metadata')) {
          db.createObjectStore('sync-metadata', { keyPath: 'key' });
        }
      }
    });
    return this.dbPromise;
  }

  async enqueue(event: AccessEvent): Promise<void> {
    const db = await this.getDb();
    await db.add(STORE_NAME, event);
    await this.refreshCount();
  }

  async dequeueAll(): Promise<AccessEvent[]> {
    const db = await this.getDb();
    return db.getAll(STORE_NAME);
  }

  async markSynced(localIds: number[]): Promise<void> {
    const db = await this.getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    for (const id of localIds) {
      await tx.store.delete(id);
    }
    await tx.done;
    await this.refreshCount();
  }

  async clearAll(): Promise<void> {
    const db = await this.getDb();
    await db.clear(STORE_NAME);
    this.pendingCount.set(0);
  }

  async refreshCount(): Promise<void> {
    const db = await this.getDb();
    const count = await db.count(STORE_NAME);
    this.pendingCount.set(count);
  }
}
