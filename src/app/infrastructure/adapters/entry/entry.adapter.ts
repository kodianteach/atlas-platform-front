/**
 * Entry Adapter - Implements EntryGateway for doorman entry control
 */
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EntryGateway } from '@domain/gateways/entry/entry.gateway';
import { EntryRecord, QRScanResult, GateLocation } from '@domain/models/entry/entry.model';
import { Result, success } from '@domain/models/common/api-response.model';

@Injectable({ providedIn: 'root' })
export class EntryAdapter extends EntryGateway {
  private readonly entries = signal<EntryRecord[]>([]);

  override getEntryLogs(): Observable<Result<EntryRecord[]>> {
    return of(success(this.entries())).pipe(delay(300));
  }

  override registerEntry(entry: Partial<EntryRecord>): Observable<Result<EntryRecord>> {
    const record: EntryRecord = {
      id: `entry-${Date.now()}`,
      visitorName: entry.visitorName || 'Unknown',
      visitorType: entry.visitorType || 'guest',
      unit: entry.unit || '',
      plate: entry.plate,
      timestamp: new Date(),
      status: entry.status || 'pending',
      accessType: entry.accessType || 'manual',
      duration: entry.duration,
      avatarUrl: entry.avatarUrl,
      guestCount: entry.guestCount,
      verified: entry.verified
    };

    this.entries.update(list => [record, ...list]);
    return of(success(record)).pipe(delay(200));
  }

  override processQRScan(qrData: string): Observable<Result<QRScanResult>> {
    // Mock QR processing
    const result: QRScanResult = {
      valid: true,
      visitorName: 'QR Visitor',
      visitorType: 'guest',
      unit: 'A-101',
      duration: '2 hours',
      timestamp: new Date()
    };
    return of(success(result)).pipe(delay(500));
  }

  override getGateLocation(): Observable<Result<GateLocation>> {
    return of(success({
      name: 'Main Entrance',
      wing: 'North',
      gateNumber: 1
    }));
  }
}
