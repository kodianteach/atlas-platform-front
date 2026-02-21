import { Component, ChangeDetectionStrategy, input, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-bottom-nav',
  standalone: true,
  templateUrl: './admin-bottom-nav.component.html',
  styleUrl: './admin-bottom-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBottomNavComponent {
  private readonly router = inject(Router);

  readonly activeTab = input<'home' | 'units' | 'porters' | 'config' | 'more'>('home');
  readonly moreMenuOpen = signal(false);

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

  isActive(tab: string): boolean {
    return this.activeTab() === tab;
  }
}
