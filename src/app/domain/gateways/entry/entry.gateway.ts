/**
 * Entry Gateway - Abstract interface for doorman entry control
 */
import { Observable } from 'rxjs';
import { EntryRecord, QRScanResult, GateLocation } from '@domain/models/entry/entry.model';
import { Result } from '@domain/models/common/api-response.model';

export abstract class EntryGateway {
  /**
   * Get recent entry records
   */
  abstract getEntryLogs(): Observable<Result<EntryRecord[]>>;

  /**
   * Register a new entry
   * @param entry - Entry record data
   */
  abstract registerEntry(entry: Partial<EntryRecord>): Observable<Result<EntryRecord>>;

  /**
   * Process QR scan result
   * @param qrData - QR code data string
   */
  abstract processQRScan(qrData: string): Observable<Result<QRScanResult>>;

  /**
   * Get the current gate location
   */
  abstract getGateLocation(): Observable<Result<GateLocation>>;
}
