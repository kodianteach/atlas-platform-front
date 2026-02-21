import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Authorization, AuthorizationFormValue, SERVICE_TYPE_LABELS, STATUS_LABELS, isAuthorizationValid } from '@domain/models/authorization/authorization.model';
import { GetAuthorizationsUseCase } from '@domain/use-cases/authorization/get-authorizations.use-case';
import { CreateAuthorizationUseCase } from '@domain/use-cases/authorization/create-authorization.use-case';
import { AuthorizationFormComponent } from '../../ui/organisms/authorization-form/authorization-form.component';
import { BottomNavComponent } from '../../ui/organisms/bottom-nav/bottom-nav.component';

/**
 * Authorization Page Component - Main page for managing visitor authorizations
 * HU #6 - Refactored to use use cases instead of AuthorizationService
 */
@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    AuthorizationFormComponent,
    BottomNavComponent
  ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationComponent implements OnInit, OnDestroy {
  private readonly getAuthorizationsUseCase = inject(GetAuthorizationsUseCase);
  private readonly createAuthorizationUseCase = inject(CreateAuthorizationUseCase);
  private readonly router = inject(Router);

  @ViewChild(AuthorizationFormComponent) formComponent?: AuthorizationFormComponent;

  readonly showForm = signal(false);
  readonly authorizations = signal<Authorization[]>([]);
  readonly searchQuery = signal('');
  readonly activeFilter = signal<'all' | 'active' | 'expired'>('all');
  readonly loading = signal(true);
  readonly showSuccessToast = signal(false);
  readonly showErrorToast = signal(false);
  readonly toastMessage = signal('');

  readonly filteredAuthorizations = computed(() => {
    let filtered = [...this.authorizations()];
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(auth =>
        auth.personName.toLowerCase().includes(query) ||
        auth.personDocument.toLowerCase().includes(query)
      );
    }
    const filter = this.activeFilter();
    if (filter === 'active') {
      filtered = filtered.filter(auth => isAuthorizationValid(auth));
    } else if (filter === 'expired') {
      filtered = filtered.filter(auth => !isAuthorizationValid(auth));
    }
    return filtered;
  });

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadAuthorizations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAuthorizations(): void {
    this.loading.set(true);
    this.getAuthorizationsUseCase.execute()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.loading.set(false);
        if (result.success) {
          this.authorizations.set(result.data);
        } else {
          this.displayErrorToast(result.error.message);
        }
      });
  }

  setFilter(filter: 'all' | 'active' | 'expired'): void {
    this.activeFilter.set(filter);
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onPlusButtonClick(): void {
    this.showForm.set(true);
  }

  onFormSubmit(formValue: AuthorizationFormValue): void {
    const document = this.formComponent?.getSelectedDocument() ?? undefined;
    this.createAuthorizationUseCase.execute(formValue, document)
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.success) {
          this.showForm.set(false);
          this.displaySuccessToast('Autorización creada exitosamente');
          this.loadAuthorizations();
          // Navigate to detail to show QR
          this.router.navigate(['/authorization', result.data.id]);
        } else {
          this.displayErrorToast(result.error.message);
        }
      });
  }

  onFormCancel(): void {
    this.showForm.set(false);
  }

  onViewDetail(auth: Authorization): void {
    this.router.navigate(['/authorization', auth.id]);
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
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  isValid(auth: Authorization): boolean {
    return isAuthorizationValid(auth);
  }

  private displaySuccessToast(message: string): void {
    this.toastMessage.set(message);
    this.showSuccessToast.set(true);
    setTimeout(() => this.showSuccessToast.set(false), 3000);
  }

  private displayErrorToast(message: string): void {
    this.toastMessage.set(message);
    this.showErrorToast.set(true);
    setTimeout(() => this.showErrorToast.set(false), 3000);
  }
}

