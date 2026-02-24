import { Injectable, inject, effect, DestroyRef } from '@angular/core';
import { PwaUpdateService } from './pwa-update.service';
import { OfflineEventQueueService } from './offline-event-queue.service';
import { RevocationCacheService } from './revocation-cache.service';
import { EntryGateway } from '@domain/gateways/entry/entry.gateway';

@Injectable({ providedIn: 'root' })
export class EventSyncService {

  private readonly pwaUpdate = inject(PwaUpdateService);
  private readonly eventQueue = inject(OfflineEventQueueService);
  private readonly revocationCache = inject(RevocationCacheService);
  private readonly entryGateway = inject(EntryGateway);
  private readonly destroyRef = inject(DestroyRef);

  private syncIntervalId: ReturnType<typeof setInterval> | null = null;
  private isSyncing = false;
  private initialized = false;

  // Effect must be created in the injection context (field initializer)
  private readonly onlineEffect = effect(() => {
    const online = this.pwaUpdate.isOnline();
    if (online && this.initialized) {
      this.flushPendingEvents();
      this.pullRevocations();
    }
  });

  initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Initial flush if already online
    if (this.pwaUpdate.isOnline()) {
      this.flushPendingEvents();
      this.pullRevocations();
    }

    // Periodic sync every 60 seconds when online
    this.syncIntervalId = setInterval(() => {
      if (this.pwaUpdate.isOnline()) {
        this.flushPendingEvents();
        this.pullRevocations();
      }
    }, 60000);

    this.destroyRef.onDestroy(() => {
      if (this.syncIntervalId) {
        clearInterval(this.syncIntervalId);
      }
    });
  }

  async flushPendingEvents(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const pendingEvents = await this.eventQueue.dequeueAll();
      if (pendingEvents.length === 0) return;

      this.entryGateway.syncEvents(pendingEvents).subscribe({
        next: (result) => {
          if (result.success && result.data) {
            const localIds = pendingEvents
              .map((_, index) => index + 1)
              .filter((_, index) => index < pendingEvents.length);
            this.eventQueue.markSynced(localIds);
          }
        },
        error: (err) => console.error('Error syncing events:', err)
      });
    } finally {
      this.isSyncing = false;
    }
  }

  async pullRevocations(): Promise<void> {
    try {
      const since = await this.revocationCache.getLastSyncTimestamp();
      this.entryGateway.getRevocations(since || '').subscribe({
        next: (result) => {
          if (result.success && result.data) {
            this.revocationCache.updateFromServer(result.data);
          }
        },
        error: (err) => console.error('Error pulling revocations:', err)
      });
    } catch (err) {
      console.error('Error in pullRevocations:', err);
    }
  }
}
