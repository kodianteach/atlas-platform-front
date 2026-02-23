/**
 * Entry Adapter - Implements EntryGateway for doorman entry control
 * HU #7: Real HTTP implementation for porter access + legacy mock methods
 */
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EntryGateway } from '@domain/gateways/entry/entry.gateway';
import { EntryRecord, QRScanResult, GateLocation, AccessEvent, VisitorAuthorizationSummary } from '@domain/models/entry/entry.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class EntryAdapter extends EntryGateway {
  private readonly http = inject(HttpClient);
  private readonly entries = signal<EntryRecord[]>([]);
  private readonly apiUrl = environment.apiUrl;

  // ═══ Legacy methods (kept for backward compatibility) ═══

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

  // ═══ HU #7: Real HTTP endpoints ═══

  override validateOnline(signedQr: string): Observable<Result<AccessEvent>> {
    return this.http.post<{ data: AccessEvent }>(`${this.apiUrl}/porter/validate-authorization`, { signedQr }).pipe(
      map(res => success(res.data)),
      catchError(err => of(failure<AccessEvent>({ code: 'VALIDATE_ONLINE_ERROR', message: err.error?.message || 'Error de validación', timestamp: new Date() })))
    );
  }

  override findByDocument(document: string): Observable<Result<VisitorAuthorizationSummary[]>> {
    return this.http.get<{ data: VisitorAuthorizationSummary[] }>(
      `${this.apiUrl}/porter/validate-by-document`, { params: { document } }
    ).pipe(
      map(res => success(res.data)),
      catchError(err => of(failure<VisitorAuthorizationSummary[]>({ code: 'FIND_BY_DOCUMENT_ERROR', message: err.error?.message || 'Error buscando por documento', timestamp: new Date() })))
    );
  }

  override validateByDocument(authorizationId: number): Observable<Result<AccessEvent>> {
    return this.http.post<{ data: AccessEvent }>(
      `${this.apiUrl}/porter/validate-by-document`, { authorizationId }
    ).pipe(
      map(res => success(res.data)),
      catchError(err => of(failure<AccessEvent>({ code: 'VALIDATE_BY_DOC_ERROR', message: err.error?.message || 'Error de validación', timestamp: new Date() })))
    );
  }

  override syncEvents(events: AccessEvent[]): Observable<Result<AccessEvent[]>> {
    return this.http.post<{ data: { syncedIds: number[] } }>(`${this.apiUrl}/porter/access-events/sync`, events).pipe(
      map(res => success(events.map((e, i) => ({ ...e, id: res.data.syncedIds[i], syncStatus: 'SYNCED' as const })))),
      catchError(err => of(failure<AccessEvent[]>({ code: 'SYNC_EVENTS_ERROR', message: err.error?.message || 'Error de sincronización', timestamp: new Date() })))
    );
  }

  override getRevocations(since: string): Observable<Result<number[]>> {
    return this.http.get<{ data: number[] }>(`${this.apiUrl}/porter/revocations`, {
      params: since ? { since } : undefined
    }).pipe(
      map(res => success(res.data)),
      catchError(err => of(failure<number[]>({ code: 'GET_REVOCATIONS_ERROR', message: err.error?.message || 'Error obteniendo revocaciones', timestamp: new Date() })))
    );
  }

  override registerVehicleExit(data: { vehiclePlate: string; personName: string }): Observable<Result<AccessEvent>> {
    return this.http.post<{ data: AccessEvent }>(`${this.apiUrl}/porter/vehicle-exit`, data).pipe(
      map(res => success(res.data)),
      catchError(err => of(failure<AccessEvent>({ code: 'VEHICLE_EXIT_ERROR', message: err.error?.message || 'Error registrando salida', timestamp: new Date() })))
    );
  }

  override getAccessHistory(): Observable<Result<AccessEvent[]>> {
    return this.http.get<{ data: AccessEvent[] }>(`${this.apiUrl}/porter/access-events`).pipe(
      map(res => success(res.data || [])),
      catchError(err => of(failure<AccessEvent[]>({ code: 'ACCESS_HISTORY_ERROR', message: err.error?.message || 'Error cargando historial', timestamp: new Date() })))
    );
  }
}
