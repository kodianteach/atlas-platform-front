import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EntryRecord, QRScanResult, GateLocation } from '../models/entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryControlService {
  private entriesSubject = new BehaviorSubject<EntryRecord[]>([]);
  public entries$ = this.entriesSubject.asObservable();

  private currentGateSubject = new BehaviorSubject<GateLocation>({
    name: 'West Wing',
    wing: 'West Wing',
    gateNumber: 1
  });
  public currentGate$ = this.currentGateSubject.asObservable();

  constructor() {
    this.initializeMockEntries();
  }

  /**
   * Simulate QR code scan
   */
  scanQRCode(qrData: string): Observable<QRScanResult> {
    // Simulate scanning delay
    const mockResult: QRScanResult = {
      valid: true,
      visitorName: 'Mr. James Sterling',
      visitorType: 'resident',
      unit: 'Unit 402',
      duration: 'Day Pass',
      plate: 'XYZ-884',
      guestCount: 2,
      timestamp: new Date(),
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      badge: 'Verified Just Now'
    };

    return of(mockResult).pipe(delay(1000));
  }

  /**
   * Grant access and log entry
   */
  grantAccess(scanResult: QRScanResult): Observable<EntryRecord> {
    const entry: EntryRecord = {
      id: Date.now().toString(),
      visitorName: scanResult.visitorName,
      visitorType: scanResult.visitorType,
      unit: scanResult.unit,
      plate: scanResult.plate,
      timestamp: new Date(),
      status: 'valid',
      accessType: 'qr',
      duration: scanResult.duration,
      avatarUrl: scanResult.avatarUrl,
      guestCount: scanResult.guestCount,
      verified: true
    };

    const currentEntries = this.entriesSubject.value;
    this.entriesSubject.next([entry, ...currentEntries]);

    return of(entry).pipe(delay(500));
  }

  /**
   * Get all entries
   */
  getEntries(): Observable<EntryRecord[]> {
    return this.entries$;
  }

  /**
   * Get entries filtered by status
   */
  getEntriesByStatus(status: 'valid' | 'denied' | 'all'): Observable<EntryRecord[]> {
    if (status === 'all') {
      return this.entries$;
    }
    
    return new Observable(observer => {
      this.entries$.subscribe(entries => {
        observer.next(entries.filter(e => e.status === status));
      });
    });
  }

  /**
   * Initialize mock entries
   */
  private initializeMockEntries(): void {
    const now = new Date();
    const mockEntries: EntryRecord[] = [
      {
        id: '1',
        visitorName: 'Michael Foster',
        visitorType: 'resident',
        unit: 'Unit 402',
        plate: 'ABC-1234',
        timestamp: new Date(now.getTime() - 18 * 60000), // 18 min ago
        status: 'valid',
        accessType: 'qr',
        avatarUrl: 'https://i.pravatar.cc/150?img=11',
        verified: true
      },
      {
        id: '2',
        visitorName: 'Unknown Visitor',
        visitorType: 'unauthorized',
        unit: 'Unit 105',
        plate: 'XYZ-9876',
        timestamp: new Date(now.getTime() - 105 * 60000), // 1h 45min ago
        status: 'denied',
        accessType: 'manual'
      },
      {
        id: '3',
        visitorName: 'Jessica Smith',
        visitorType: 'guest',
        unit: 'Unit 808',
        timestamp: new Date(now.getTime() - 125 * 60000), // 2h 5min ago
        status: 'valid',
        accessType: 'walk-in',
        avatarUrl: 'https://i.pravatar.cc/150?img=9'
      },
      {
        id: '4',
        visitorName: 'FedEx Delivery',
        visitorType: 'delivery',
        unit: 'Package Room',
        plate: 'TK-421',
        timestamp: new Date(now.getTime() - 150 * 60000), // 2h 30min ago
        status: 'valid',
        accessType: 'qr'
      },
      {
        id: '5',
        visitorName: 'Amazon Delivery',
        visitorType: 'delivery',
        unit: 'Unit 105',
        timestamp: new Date(now.getTime() - 24 * 60 * 60000), // Yesterday
        status: 'valid',
        accessType: 'qr'
      }
    ];

    this.entriesSubject.next(mockEntries);
  }
}
