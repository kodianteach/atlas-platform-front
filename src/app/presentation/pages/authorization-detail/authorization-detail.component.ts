import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Authorization, SERVICE_TYPE_LABELS, STATUS_LABELS } from '@domain/models/authorization/authorization.model';
import { GetAuthorizationByIdUseCase } from '@domain/use-cases/authorization/get-authorization-by-id.use-case';
import { RevokeAuthorizationUseCase } from '@domain/use-cases/authorization/revoke-authorization.use-case';
import { AuthorizationGateway } from '@domain/gateways/authorization/authorization.gateway';
import { QrDisplayComponent } from '../../ui/molecules/qr-display/qr-display.component';
import { ShareActionsComponent } from '../../ui/molecules/share-actions/share-actions.component';
import { ButtonComponent } from '../../ui/atoms/button/button.component';
import { BottomNavComponent } from '../../ui/organisms/bottom-nav/bottom-nav.component';

/**
 * Authorization Detail Page - Shows full authorization with QR code
 * HU #6 - Detail view with QR display, share actions, and revoke option
 */
@Component({
  selector: 'app-authorization-detail',
  standalone: true,
  imports: [
    RouterLink,
    QrDisplayComponent,
    ShareActionsComponent,
    ButtonComponent,
    BottomNavComponent
  ],
  template: `
    <div class="detail-page">
      <header class="detail-header">
        <button class="back-btn" (click)="goBack()">
          <i class="bi bi-arrow-left"></i>
        </button>
        <h1>Detalle de Autorización</h1>
      </header>

      @if (loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Cargando autorización...</p>
        </div>
      }

      @if (error()) {
        <div class="error-container">
          <i class="bi bi-exclamation-triangle"></i>
          <p>{{ error() }}</p>
          <button class="retry-btn" (click)="loadAuthorization()">Reintentar</button>
        </div>
      }

      @if (authorization()) {
        <div class="detail-content">
          <!-- Status Badge -->
          <div class="status-section">
            <span class="status-badge" [class]="'status-' + authorization()!.status.toLowerCase()">
              {{ getStatusLabel(authorization()!.status) }}
            </span>
          </div>

          <!-- QR Code -->
          @if (authorization()!.signedQr) {
            <div class="qr-section">
              <app-qr-display
                [imageUrl]="qrImageUrl()"
                altText="QR de autorización" />
            </div>
          }

          <!-- Person Info -->
          <div class="info-card">
            <h3><i class="bi bi-person-fill"></i> Datos del Visitante</h3>
            <div class="info-row">
              <span class="info-label">Nombre</span>
              <span class="info-value">{{ authorization()!.personName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Documento</span>
              <span class="info-value">{{ authorization()!.personDocument }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tipo de servicio</span>
              <span class="info-value">{{ getServiceTypeLabel(authorization()!.serviceType) }}</span>
            </div>
          </div>

          <!-- Validity Info -->
          <div class="info-card">
            <h3><i class="bi bi-clock"></i> Vigencia</h3>
            <div class="info-row">
              <span class="info-label">Desde</span>
              <span class="info-value">{{ formatDate(authorization()!.validFrom) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Hasta</span>
              <span class="info-value">{{ formatDate(authorization()!.validTo) }}</span>
            </div>
          </div>

          <!-- Vehicle Info -->
          @if (authorization()!.vehiclePlate) {
            <div class="info-card">
              <h3><i class="bi bi-car-front"></i> Vehículo</h3>
              <div class="info-row">
                <span class="info-label">Placa</span>
                <span class="info-value">{{ authorization()!.vehiclePlate }}</span>
              </div>
              @if (authorization()!.vehicleType) {
                <div class="info-row">
                  <span class="info-label">Tipo</span>
                  <span class="info-value">{{ authorization()!.vehicleType }}</span>
                </div>
              }
              @if (authorization()!.vehicleColor) {
                <div class="info-row">
                  <span class="info-label">Color</span>
                  <span class="info-value">{{ authorization()!.vehicleColor }}</span>
                </div>
              }
            </div>
          }

          <!-- Share Actions -->
          @if (authorization()!.status === 'ACTIVE' && authorization()!.signedQr) {
            <div class="share-section">
              <h3>Compartir autorización</h3>
              <app-share-actions
                [shareUrl]="getShareUrl()"
                [personName]="authorization()!.personName" />
            </div>
          }

          <!-- Revoke Action -->
          @if (authorization()!.status === 'ACTIVE') {
            <div class="actions-section">
              <button class="revoke-btn" (click)="onRevoke()" [disabled]="revoking()">
                <i class="bi bi-x-circle"></i>
                {{ revoking() ? 'Revocando...' : 'Revocar Autorización' }}
              </button>
            </div>
          }
        </div>
      }

      <app-bottom-nav />
    </div>
  `,
  styles: [`
    .detail-page {
      min-height: 100vh;
      background: #f8f9fa;
      padding-bottom: 80px;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: white;
      border-bottom: 1px solid #e9ecef;
    }

    .detail-header h1 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
    }

    .back-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      color: #495057;
    }

    .back-btn:hover { background: #e9ecef; }

    .detail-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-section { text-align: center; }

    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-ACTIVE, .status-active { background: #d4edda; color: #155724; }
    .status-REVOKED, .status-revoked { background: #f8d7da; color: #721c24; }
    .status-EXPIRED, .status-expired { background: #fff3cd; color: #856404; }

    .qr-section {
      display: flex;
      justify-content: center;
      padding: 16px 0;
    }

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .info-card h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9375rem;
      font-weight: 600;
      margin: 0 0 12px 0;
      color: #343a40;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f1f3f5;
    }

    .info-row:last-child { border-bottom: none; }
    .info-label { color: #6c757d; font-size: 0.875rem; }
    .info-value { font-weight: 500; color: #212529; font-size: 0.875rem; }

    .share-section {
      text-align: center;
    }

    .share-section h3 {
      font-size: 0.9375rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: #343a40;
    }

    .actions-section {
      padding: 8px 0;
    }

    .revoke-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border: 2px solid #dc3545;
      background: transparent;
      color: #dc3545;
      border-radius: 10px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .revoke-btn:hover:not(:disabled) {
      background: #dc3545;
      color: white;
    }

    .revoke-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 16px;
      color: #6c757d;
      gap: 12px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e9ecef;
      border-top-color: #4caf50;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .error-container i { font-size: 2.5rem; color: #dc3545; }

    .retry-btn {
      padding: 8px 20px;
      border: 1px solid #6c757d;
      border-radius: 8px;
      background: transparent;
      color: #495057;
      cursor: pointer;
    }

    .retry-btn:hover { background: #e9ecef; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly getByIdUseCase = inject(GetAuthorizationByIdUseCase);
  private readonly revokeUseCase = inject(RevokeAuthorizationUseCase);
  private readonly authorizationGateway = inject(AuthorizationGateway);

  readonly authorization = signal<Authorization | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string>('');
  readonly revoking = signal(false);

  private authorizationId = 0;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.authorizationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAuthorization();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAuthorization(): void {
    this.loading.set(true);
    this.error.set('');

    this.getByIdUseCase.execute(this.authorizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.loading.set(false);
        if (result.success) {
          this.authorization.set(result.data);
        } else {
          this.error.set(result.error.message);
        }
      });
  }

  qrImageUrl(): string {
    return this.authorizationGateway.getQrImageUrl(this.authorizationId);
  }

  getShareUrl(): string {
    return `${window.location.origin}/authorization/verify/${this.authorizationId}`;
  }

  getServiceTypeLabel(type: string): string {
    return SERVICE_TYPE_LABELS[type as keyof typeof SERVICE_TYPE_LABELS] || type;
  }

  getStatusLabel(status: string): string {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  onRevoke(): void {
    if (!confirm('¿Está seguro de revocar esta autorización? Esta acción no se puede deshacer.')) {
      return;
    }

    this.revoking.set(true);
    this.revokeUseCase.execute(this.authorizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.revoking.set(false);
        if (result.success) {
          this.authorization.set(result.data);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/authorization']);
  }
}
