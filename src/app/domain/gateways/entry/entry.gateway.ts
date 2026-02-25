/**
 * Entry Gateway - Abstract interface for doorman entry control
 */
import { Observable } from 'rxjs';
import { EntryRecord, QRScanResult, GateLocation, AccessEvent, VisitorAuthorizationSummary } from '@domain/models/entry/entry.model';
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

  // ═══ HU #7: Validación en Portería ═══

  /**
   * Validate authorization online via signed QR.
   */
  abstract validateOnline(signedQr: string): Observable<Result<AccessEvent>>;

  /**
   * Search active authorizations by person document number.
   */
  abstract findByDocument(document: string): Observable<Result<VisitorAuthorizationSummary[]>>;

  /**
   * Validate and register access by selecting an authorization found by document.
   */
  abstract validateByDocument(authorizationId: number): Observable<Result<AccessEvent>>;

  /**
   * Sync offline events batch to backend.
   */
  abstract syncEvents(events: AccessEvent[]): Observable<Result<AccessEvent[]>>;

  /**
   * Get revoked authorization IDs since timestamp.
   */
  abstract getRevocations(since: string): Observable<Result<number[]>>;

  /**
   * Register vehicle exit.
   */
  abstract registerVehicleExit(data: { vehiclePlate: string; personName: string }): Observable<Result<AccessEvent>>;

  /**
   * Get access event history.
   */
  abstract getAccessHistory(): Observable<Result<AccessEvent[]>>;
}
