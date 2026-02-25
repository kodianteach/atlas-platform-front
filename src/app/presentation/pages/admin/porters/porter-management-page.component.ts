import { Component, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminBottomNavComponent } from '../../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';
import { PorterListComponent } from '../../../ui/organisms/porter-list/porter-list.component';
import { PorterCreateFormComponent } from '../../../ui/organisms/porter-create-form/porter-create-form.component';
import { EnrollmentUrlComponent } from '../../../ui/organisms/enrollment-url/enrollment-url.component';
import { ListPortersUseCase } from '@domain/use-cases/porter/list-porters.use-case';
import { CreatePorterUseCase } from '@domain/use-cases/porter/create-porter.use-case';
import { RegeneratePorterUrlUseCase } from '@domain/use-cases/porter/regenerate-porter-url.use-case';
import { TogglePorterStatusUseCase } from '@domain/use-cases/porter/toggle-porter-status.use-case';
import { Porter, CreatePorterRequest } from '@domain/models/porter/porter.model';

@Component({
  selector: 'app-porter-management-page',
  standalone: true,
  imports: [
    CommonModule,
    AdminBottomNavComponent,
    PorterListComponent,
    PorterCreateFormComponent,
    EnrollmentUrlComponent
  ],
  templateUrl: './porter-management-page.component.html',
  styleUrl: './porter-management-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PorterManagementPageComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly listPortersUseCase = inject(ListPortersUseCase);
  private readonly createPorterUseCase = inject(CreatePorterUseCase);
  private readonly regenerateUrlUseCase = inject(RegeneratePorterUrlUseCase);
  private readonly toggleStatusUseCase = inject(TogglePorterStatusUseCase);
  private readonly destroyRef = inject(DestroyRef);

  readonly porters = signal<Porter[]>([]);
  readonly loading = signal(false);
  readonly showCreateForm = signal(false);
  readonly enrollmentUrl = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPorters();
  }

  loadPorters(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.listPortersUseCase.execute().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.loading.set(false);
      if (result.success) {
        this.porters.set(result.data);
      } else {
        this.errorMessage.set(result.error.message);
      }
    });
  }

  onCreatePorter(request: CreatePorterRequest): void {
    this.loading.set(true);

    this.createPorterUseCase.execute(request).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.loading.set(false);
      if (result.success) {
        this.showCreateForm.set(false);
        if (result.data.enrollmentUrl) {
          this.enrollmentUrl.set(result.data.enrollmentUrl);
        }
        this.loadPorters();
      } else {
        this.errorMessage.set(result.error.message);
      }
    });
  }

  onRegenerateUrl(porterId: number): void {
    this.loading.set(true);

    this.regenerateUrlUseCase.execute(porterId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.loading.set(false);
      if (result.success) {
        this.enrollmentUrl.set(result.data.enrollmentUrl);
      } else {
        this.errorMessage.set(result.error.message);
      }
    });
  }

  onToggleStatus(porterId: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.toggleStatusUseCase.execute(porterId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.loading.set(false);
      if (result.success) {
        this.loadPorters();
      } else {
        this.errorMessage.set(result.error.message);
      }
    });
  }

  onToggleCreateForm(): void {
    this.showCreateForm.update(v => !v);
    this.errorMessage.set(null);
  }

  onCloseEnrollmentUrl(): void {
    this.enrollmentUrl.set(null);
  }

  onDismissError(): void {
    this.errorMessage.set(null);
  }

  goBack(): void {
    this.location.back();
  }
}
