import { Component, ChangeDetectionStrategy, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { AdminBottomNavComponent } from '../../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';
import { CreateOwnerInvitationUseCase } from '@domain/use-cases/invitation/create-owner-invitation.use-case';
import { UrlHelperService } from '@infrastructure/services/url-helper.service';

type PageState = 'idle' | 'generating' | 'link-ready' | 'error';

@Component({
  selector: 'app-invitation-management-page',
  standalone: true,
  imports: [
    TranslateModule,
    AdminBottomNavComponent
  ],
  templateUrl: './invitation-management-page.component.html',
  styleUrl: './invitation-management-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitationManagementPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly createOwnerInvitationUseCase = inject(CreateOwnerInvitationUseCase);
  private readonly destroyRef = inject(DestroyRef);
  private readonly urlHelper = inject(UrlHelperService);

  readonly state = signal<PageState>('idle');
  readonly invitationUrl = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly linkCopied = signal(false);

  ngOnInit(): void {
    // Future: load invitation history here
  }

  generateOwnerInvitation(): void {
    this.state.set('generating');
    this.errorMessage.set(null);
    this.linkCopied.set(false);

    this.createOwnerInvitationUseCase.execute().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result.success) {
        this.invitationUrl.set(this.urlHelper.normalizeUrl(result.data.invitationUrl));
        this.state.set('link-ready');
      } else {
        this.errorMessage.set(result.error.message);
        this.state.set('error');
      }
    });
  }

  async copyLink(): Promise<void> {
    const url = this.invitationUrl();
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        this.linkCopied.set(true);
        setTimeout(() => this.linkCopied.set(false), 3000);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.linkCopied.set(true);
        setTimeout(() => this.linkCopied.set(false), 3000);
      }
    }
  }

  generateAnother(): void {
    this.state.set('idle');
    this.invitationUrl.set(null);
    this.linkCopied.set(false);
  }

  dismissError(): void {
    this.state.set('idle');
    this.errorMessage.set(null);
  }

  goBack(): void {
    this.router.navigate(['/admin/more']);
  }
}
