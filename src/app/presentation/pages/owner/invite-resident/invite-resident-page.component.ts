/**
 * Invite Resident Page Component
 *
 * Allows OWNER users to generate a resident invitation link.
 * When org config enableOwnerPermissionManagement is active,
 * shows permission selection step before generating the link (Scenario 12).
 * When inactive, generates directly (Scenario 13).
 */
import { Component, ChangeDetectionStrategy, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../ui/organisms/page-header/page-header.component';
import { BottomNavComponent } from '../../../ui/organisms/bottom-nav/bottom-nav.component';
import { CreateResidentInvitationUseCase } from '@domain/use-cases/invitation/create-resident-invitation.use-case';
import { GetOrganizationConfigUseCase } from '@domain/use-cases/organization/get-organization-config.use-case';
import { GlobalNotificationService } from '@infrastructure/services/global-notification.service';
import { UrlHelperService } from '@infrastructure/services/url-helper.service';

type PageState = 'loading' | 'idle' | 'select-permissions' | 'generating' | 'link-ready' | 'error';

interface PermissionOption {
  key: string;
  label: string;
  description: string;
  icon: string;
  checked: boolean;
}

@Component({
  selector: 'app-invite-resident-page',
  standalone: true,
  imports: [
    TranslateModule,
    PageHeaderComponent,
    BottomNavComponent
  ],
  templateUrl: './invite-resident-page.component.html',
  styleUrl: './invite-resident-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InviteResidentPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly createResidentInvitationUseCase = inject(CreateResidentInvitationUseCase);
  private readonly getOrgConfigUseCase = inject(GetOrganizationConfigUseCase);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notify = inject(GlobalNotificationService);
  private readonly urlHelper = inject(UrlHelperService);

  readonly state = signal<PageState>('loading');
  readonly invitationUrl = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly linkCopied = signal(false);
  readonly permissionManagementEnabled = signal(false);

  readonly permissions = signal<PermissionOption[]>([
    { key: 'VISITS_CREATE', label: 'Crear autorizaciones', description: 'Permite solicitar autorizaciones de ingreso', icon: 'bi-plus-circle', checked: true },
    { key: 'VISITS_READ', label: 'Ver autorizaciones', description: 'Permite ver las autorizaciones existentes', icon: 'bi-eye', checked: true },
    { key: 'VISITS_UPDATE', label: 'Editar autorizaciones', description: 'Permite modificar autorizaciones', icon: 'bi-pencil', checked: true },
    { key: 'VISITS_DELETE', label: 'Cancelar autorizaciones', description: 'Permite cancelar autorizaciones', icon: 'bi-trash', checked: false }
  ]);

  ngOnInit(): void {
    this.loadOrgConfig();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  /** Called when user clicks "Generate invitation" from idle state */
  onGenerateClick(): void {
    if (this.permissionManagementEnabled()) {
      this.state.set('select-permissions');
    } else {
      this.generateInvitation();
    }
  }

  /** Called from permission selection to go back to idle */
  backToIdle(): void {
    this.state.set('idle');
  }

  /** Toggle a permission checkbox */
  togglePermission(key: string): void {
    const updated = this.permissions().map(p =>
      p.key === key ? { ...p, checked: !p.checked } : p
    );
    this.permissions.set(updated);
  }

  /** Generate with selected permissions (from select-permissions state) */
  generateWithPermissions(): void {
    const selected: Record<string, boolean> = {};
    for (const p of this.permissions()) {
      selected[p.key] = p.checked;
    }
    this.generateInvitation(selected);
  }

  /** Generate invitation, optionally with permissions */
  generateInvitation(permissions?: Record<string, boolean>): void {
    this.state.set('generating');
    this.errorMessage.set(null);
    this.linkCopied.set(false);

    const request = permissions ? { permissions } : undefined;

    this.createResidentInvitationUseCase.execute(request).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result.success) {
        this.invitationUrl.set(this.urlHelper.normalizeUrl(result.data.invitationUrl));
        this.state.set('link-ready');
        this.notify.success('Enlace de invitación generado');
      } else {
        this.errorMessage.set(result.error.message);
        this.state.set('error');
        this.notify.error(result.error.message || 'Error al generar invitación');
      }
    });
  }

  async copyLink(): Promise<void> {
    const url = this.invitationUrl();
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        this.linkCopied.set(true);
        this.notify.success('Enlace copiado al portapapeles');
        setTimeout(() => this.linkCopied.set(false), 3000);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.linkCopied.set(true);
        this.notify.success('Enlace copiado al portapapeles');
        setTimeout(() => this.linkCopied.set(false), 3000);
      }
    }
  }

  shareViaWhatsApp(): void {
    const url = this.invitationUrl();
    if (url) {
      const message = encodeURIComponent(
        `¡Hola! Te invito a unirte a nuestra unidad residencial. Regístrate usando este enlace: ${url}`
      );
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  }

  generateAnother(): void {
    this.state.set('idle');
    this.invitationUrl.set(null);
    this.linkCopied.set(false);
    // Reset permissions to defaults
    this.permissions.set([
      { key: 'VISITS_CREATE', label: 'Crear autorizaciones', description: 'Permite solicitar autorizaciones de ingreso', icon: 'bi-plus-circle', checked: true },
      { key: 'VISITS_READ', label: 'Ver autorizaciones', description: 'Permite ver las autorizaciones existentes', icon: 'bi-eye', checked: true },
      { key: 'VISITS_UPDATE', label: 'Editar autorizaciones', description: 'Permite modificar autorizaciones', icon: 'bi-pencil', checked: true },
      { key: 'VISITS_DELETE', label: 'Cancelar autorizaciones', description: 'Permite cancelar autorizaciones', icon: 'bi-trash', checked: false }
    ]);
  }

  dismissError(): void {
    this.state.set('idle');
    this.errorMessage.set(null);
  }

  private loadOrgConfig(): void {
    this.getOrgConfigUseCase.execute().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      if (result.success) {
        this.permissionManagementEnabled.set(result.data.enableOwnerPermissionManagement ?? false);
      }
      this.state.set('idle');
    });
  }
}
