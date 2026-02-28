import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-admin-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-bottom-nav.component.html',
  styleUrl: './admin-bottom-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBottomNavComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);

  readonly activeTab = input<'home' | 'authorizations' | 'owners' | 'communications' | 'more'>('home');

  /**
   * Verifica si el usuario es administrador supremo (ADMIN_ATLAS)
   * El botón FAB no debe mostrarse para este tipo de administrador
   */
  isSupremeAdmin(): boolean {
    const user = this.authService.getUser();
    return user?.role === 'ADMIN_ATLAS' || user?.roles?.includes('ADMIN_ATLAS') || false;
  }

  navigateTo(tab: string): void {
    const routes: Record<string, string> = {
      home: '/home',
      authorizations: '/admin/authorizations',
      owners: '/admin/invitations',
      communications: '/admin/communications',
      more: '/admin/more'
    };
    const route = routes[tab];
    if (route) {
      this.router.navigate([route]);
    }
  }

  isActive(tab: string): boolean {
    return this.activeTab() === tab;
  }
}
