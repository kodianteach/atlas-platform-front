import { Component, ChangeDetectionStrategy, input, inject, signal } from '@angular/core';
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

  readonly activeTab = input<'home' | 'units' | 'porters' | 'config' | 'more'>('home');
  readonly moreMenuOpen = signal(false);

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
      units: '/admin/units',
      porters: '/admin/porters',
      config: '/admin/organization-config'
    };
    const route = routes[tab];
    if (route) {
      this.moreMenuOpen.set(false);
      this.router.navigate([route]);
    }
  }

  toggleMoreMenu(): void {
    this.moreMenuOpen.update(v => !v);
  }

  closeMoreMenu(): void {
    this.moreMenuOpen.set(false);
  }

  navigateToInvitations(): void {
    this.moreMenuOpen.set(false);
    this.router.navigate(['/admin/invitations']);
  }

  logout(): void {
    this.moreMenuOpen.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isActive(tab: string): boolean {
    return this.activeTab() === tab;
  }
}
