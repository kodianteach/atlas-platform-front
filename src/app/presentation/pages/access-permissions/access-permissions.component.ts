import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetAuthorizationsUseCase } from '@domain/use-cases/authorization/get-authorizations.use-case';
import { RevokeAuthorizationUseCase } from '@domain/use-cases/authorization/revoke-authorization.use-case';
import { Authorization } from '@domain/models/authorization/authorization.model';
import { PageHeaderComponent } from '../../ui/organisms/page-header/page-header.component';
import { GrantAuthorizationCardComponent } from '../../ui/organisms/grant-authorization-card/grant-authorization-card.component';
import { AuthorizationListComponent } from '../../ui/organisms/authorization-list/authorization-list.component';
import { BottomNavComponent } from '../../ui/organisms/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-access-permissions',
  standalone: true,
  imports: [
    PageHeaderComponent,
    GrantAuthorizationCardComponent,
    AuthorizationListComponent,
    BottomNavComponent
  ],
  templateUrl: './access-permissions.component.html',
  styleUrl: './access-permissions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessPermissionsComponent implements OnInit, OnDestroy {
  private readonly getAuthorizationsUseCase = inject(GetAuthorizationsUseCase);
  private readonly revokeAuthorizationUseCase = inject(RevokeAuthorizationUseCase);
  private readonly router = inject(Router);

  readonly authorizations = signal<Authorization[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly toggleErrorMessage = signal<string | null>(null);

  readonly activeCount = computed(() =>
    this.authorizations().filter(auth => auth.status === 'ACTIVE').length
  );

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadAuthorizations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAuthorizations(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.getAuthorizationsUseCase.execute()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.authorizations.set(result.data);
          } else {
            this.error.set(result.error.message);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Error al cargar las autorizaciones');
          this.isLoading.set(false);
        }
      });
  }

  onBackClick(): void {
    this.router.navigate(['/']);
  }

  onHistoryClick(): void {
    this.router.navigate(['/authorization-history']);
  }

  onCreateClick(): void {
    this.router.navigate(['/authorization-form']);
  }

  onCenterAction(): void {
    this.router.navigate(['/access-permissions']);
  }

  onToggleAuthorization(authorizationId: number): void {
    const previousAuths = this.authorizations();

    this.authorizations.update(auths =>
      auths.map(a => a.id === authorizationId ? { ...a, status: a.status === 'ACTIVE' ? 'REVOKED' as const : 'ACTIVE' as const } : a)
    );

    this.revokeAuthorizationUseCase.execute(authorizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.toggleErrorMessage.set(null);
          } else {
            this.authorizations.set(previousAuths);
            this.toggleErrorMessage.set(result.error.message);
            setTimeout(() => this.toggleErrorMessage.set(null), 5000);
          }
        },
        error: () => {
          this.authorizations.set(previousAuths);
          this.toggleErrorMessage.set('Error al actualizar el estado. Intente nuevamente.');
          setTimeout(() => this.toggleErrorMessage.set(null), 5000);
        }
      });
  }

  dismissToggleError(): void {
    this.toggleErrorMessage.set(null);
  }

  handleRetryKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.loadAuthorizations();
    }
  }
}
