import { Component, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminBottomNavComponent } from '../../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';
import { GetAuthorizationsUseCase } from '@domain/use-cases/authorization/get-authorizations.use-case';
import { Authorization, AuthorizationStatus, ServiceType, STATUS_LABELS, SERVICE_TYPE_LABELS } from '@domain/models/authorization/authorization.model';

type FilterStatus = 'ALL' | AuthorizationStatus;
type FilterServiceType = 'ALL' | ServiceType;

@Component({
  selector: 'app-admin-authorizations-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminBottomNavComponent],
  templateUrl: './admin-authorizations-page.component.html',
  styleUrl: './admin-authorizations-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAuthorizationsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly getAuthorizationsUseCase = inject(GetAuthorizationsUseCase);
  private readonly destroyRef = inject(DestroyRef);

  readonly authorizations = signal<Authorization[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly filterStatus = signal<FilterStatus>('ALL');
  readonly filterServiceType = signal<FilterServiceType>('ALL');
  readonly showFilters = signal(false);

  readonly statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'ALL', label: 'Todos' },
    { value: 'ACTIVE', label: 'Activas' },
    { value: 'EXPIRED', label: 'Expiradas' },
    { value: 'REVOKED', label: 'Revocadas' }
  ];

  readonly serviceTypeOptions: { value: FilterServiceType; label: string }[] = [
    { value: 'ALL', label: 'Todos' },
    { value: 'VISIT', label: 'Visita' },
    { value: 'DELIVERY', label: 'Delivery' },
    { value: 'TECHNICIAN', label: 'Técnico' },
    { value: 'OTHER', label: 'Otro' }
  ];

  readonly filteredAuthorizations = computed(() => {
    let list = this.authorizations();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.filterStatus();
    const serviceType = this.filterServiceType();

    if (status !== 'ALL') {
      list = list.filter(a => this.getEffectiveStatus(a) === status);
    }

    if (serviceType !== 'ALL') {
      list = list.filter(a => a.serviceType === serviceType);
    }

    if (query) {
      list = list.filter(a =>
        a.personName.toLowerCase().includes(query) ||
        a.personDocument.toLowerCase().includes(query) ||
        a.vehiclePlate?.toLowerCase().includes(query)
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  readonly totalCount = computed(() => this.authorizations().length);
  readonly activeCount = computed(() => this.authorizations().filter(a => this.getEffectiveStatus(a) === 'ACTIVE').length);
  readonly filteredCount = computed(() => this.filteredAuthorizations().length);

  ngOnInit(): void {
    this.loadAuthorizations();
  }

  loadAuthorizations(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.getAuthorizationsUseCase.execute().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.loading.set(false);
      if (result.success) {
        this.authorizations.set(result.data);
      } else {
        this.errorMessage.set(result.error.message);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onStatusFilterChange(value: FilterStatus): void {
    this.filterStatus.set(value);
  }

  onServiceTypeFilterChange(value: FilterServiceType): void {
    this.filterServiceType.set(value);
  }

  toggleFilters(): void {
    this.showFilters.update(v => !v);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.filterStatus.set('ALL');
    this.filterServiceType.set('ALL');
  }

  onAuthorizationClick(auth: Authorization): void {
    this.router.navigate(['/admin/authorizations', auth.id]);
  }

  onDismissError(): void {
    this.errorMessage.set(null);
  }

  getEffectiveStatus(auth: Authorization): AuthorizationStatus {
    if (auth.status === 'REVOKED') return 'REVOKED';
    if (auth.status === 'EXPIRED') return 'EXPIRED';
    const now = new Date().toISOString();
    if (now > auth.validTo) return 'EXPIRED';
    return 'ACTIVE';
  }

  getStatusLabel(auth: Authorization): string {
    return STATUS_LABELS[this.getEffectiveStatus(auth)] || auth.status;
  }

  getStatusClass(auth: Authorization): string {
    const status = this.getEffectiveStatus(auth);
    switch (status) {
      case 'ACTIVE': return 'status--active';
      case 'EXPIRED': return 'status--expired';
      case 'REVOKED': return 'status--revoked';
      default: return '';
    }
  }

  getServiceTypeLabel(type: ServiceType): string {
    return SERVICE_TYPE_LABELS[type] || type;
  }

  getServiceTypeIcon(type: ServiceType): string {
    switch (type) {
      case 'VISIT': return 'bi-person';
      case 'DELIVERY': return 'bi-box-seam';
      case 'TECHNICIAN': return 'bi-tools';
      case 'OTHER': return 'bi-three-dots';
      default: return 'bi-person';
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  hasActiveFilters(): boolean {
    return this.filterStatus() !== 'ALL' || this.filterServiceType() !== 'ALL' || this.searchQuery().trim().length > 0;
  }
}
