/**
 * Organization Config Adapter - Implements OrganizationConfigGateway for HTTP operations
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OrganizationConfigGateway } from '@domain/gateways/organization/organization-config.gateway';
import { OrganizationConfig } from '@domain/models/organization/organization-config.model';
import { Result, success, failure } from '@domain/models/common/api-response.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class OrganizationConfigAdapter extends OrganizationConfigGateway {
  private readonly http = inject(HttpClient);

  private readonly SETTINGS_ENDPOINT = `${environment.apiUrl}/organization/settings`;

  override getConfig(): Observable<Result<OrganizationConfig>> {
    return this.http.get<{ data: OrganizationConfig }>(
      this.SETTINGS_ENDPOINT
    ).pipe(
      map(response => success<OrganizationConfig>({
        maxUnitsPerDistribution: response.data.maxUnitsPerDistribution,
        enableOwnerPermissionManagement: response.data.enableOwnerPermissionManagement ?? false,
        logoBase64: response.data.logoBase64,
        logoContentType: response.data.logoContentType,
        dominantColor: response.data.dominantColor,
        secondaryColor: response.data.secondaryColor,
        accentColor: response.data.accentColor
      })),
      catchError(error => of(this.handleError<OrganizationConfig>(error)))
    );
  }

  override saveConfig(config: OrganizationConfig): Observable<Result<OrganizationConfig>> {
    return this.http.put<{ data: OrganizationConfig; message: string }>(
      this.SETTINGS_ENDPOINT,
      config
    ).pipe(
      map(response => success<OrganizationConfig>(
        {
          maxUnitsPerDistribution: response.data.maxUnitsPerDistribution,
          enableOwnerPermissionManagement: response.data.enableOwnerPermissionManagement ?? false,
          logoBase64: response.data.logoBase64,
          logoContentType: response.data.logoContentType,
          dominantColor: response.data.dominantColor,
          secondaryColor: response.data.secondaryColor,
          accentColor: response.data.accentColor
        },
        response.message
      )),
      catchError(error => of(this.handleError<OrganizationConfig>(error)))
    );
  }

  private handleError<T>(error: unknown): Result<T> {
    const httpError = error as { status?: number; error?: { message?: string } };

    if (httpError.status === 0) {
      return failure({
        code: 'NETWORK_ERROR',
        message: 'No se pudo completar la operación. Verifica tu conexión e intenta nuevamente',
        timestamp: new Date()
      });
    }
    return failure({
      code: 'SERVER_ERROR',
      message: httpError.error?.message || 'No se pudo completar la operación. Verifica tu conexión e intenta nuevamente',
      timestamp: new Date()
    });
  }
}
