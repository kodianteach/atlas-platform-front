/**
 * Me Adapter - Implements MeGateway for authenticated user endpoints
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MeGateway } from '@domain/gateways/me/me.gateway';
import { MyResidence } from '@domain/models/me/my-residence.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class MeAdapter extends MeGateway {
  private readonly http = inject(HttpClient);

  override getMyResidence(): Observable<Result<MyResidence>> {
    const url = `${environment.apiUrl}/me/residence`;
    return this.http.get<{ data: MyResidence; message?: string }>(url).pipe(
      map(response => success(response.data, response.message)),
      catchError(error => of(this.handleError<MyResidence>(error)))
    );
  }

  private handleError<T>(error: unknown): Result<T> {
    const httpError = error as { status?: number; error?: { message?: string } };
    return failure({
      code: 'ME_ERROR',
      message: httpError.error?.message || 'No se pudo obtener la información del usuario',
      timestamp: new Date()
    });
  }
}
