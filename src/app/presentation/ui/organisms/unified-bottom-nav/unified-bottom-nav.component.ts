/**
 * UnifiedBottomNavComponent - Single bottom navigation component for all roles
 *
 * Replaces BottomNavComponent, AdminBottomNavComponent, and DoormanBottomNavComponent
 * with a single configurable component that adapts via JSON config per role.
 *
 * Roles supported: OWNER, RESIDENT, ADMIN_ATLAS, PORTERO_VIGILANTE
 */
import { Component, ChangeDetectionStrategy, input, output, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  id: string;
}

export interface RoleNavConfig {
  items: NavItem[];
  style: 'pill' | 'flat';
  showFab: boolean;
  fabIcon?: string;
}

/**
 * Navigation configuration per role - modifiable by deploy via this JSON
 */
const NAV_CONFIG: Record<string, RoleNavConfig> = {
  OWNER: {
    style: 'pill',
    showFab: true,
    fabIcon: 'bi-plus-lg',
    items: [
      { id: 'home', label: 'Inicio', icon: 'bi-house-door', route: '/home' },
      { id: 'history', label: 'Historial', icon: 'bi-clock-history', route: '/authorization' },
      { id: 'announcements', label: 'Difusión', icon: 'bi-megaphone', route: '/announcements' },
      { id: 'vehicles', label: 'Vehículos', icon: 'bi-car-front', route: '/vehicles' }
    ]
  },
  RESIDENT: {
    style: 'pill',
    showFab: true,
    fabIcon: 'bi-plus-lg',
    items: [
      { id: 'home', label: 'Inicio', icon: 'bi-house-door', route: '/home' },
      { id: 'history', label: 'Historial', icon: 'bi-clock-history', route: '/authorization' },
      { id: 'announcements', label: 'Difusión', icon: 'bi-megaphone', route: '/announcements' },
      { id: 'vehicles', label: 'Vehículos', icon: 'bi-car-front', route: '/vehicles' }
    ]
  },
  ADMIN_ATLAS: {
    style: 'flat',
    showFab: false,
    items: [
      { id: 'home', label: 'Inicio', icon: 'bi-house', route: '/home' },
      { id: 'units', label: 'Unidades', icon: 'bi-building', route: '/admin/units' },
      { id: 'communications', label: 'Comunic.', icon: 'bi-megaphone', route: '/admin/communications' },
      { id: 'config', label: 'Config', icon: 'bi-gear', route: '/admin/organization-config' },
      { id: 'more', label: 'Más', icon: 'bi-three-dots', route: '/admin/more' }
    ]
  },
  PORTERO_VIGILANTE: {
    style: 'flat',
    showFab: false,
    items: [
      { id: 'scan', label: 'Escanear', icon: 'bi-qr-code-scan', route: '/doorman/scan' },
      { id: 'history', label: 'Historial', icon: 'bi-clock-history', route: '/doorman/entry-logs' },
      { id: 'more', label: 'Más', icon: 'bi-three-dots', route: '/doorman/more' }
    ]
  }
};

@Component({
  selector: 'app-unified-bottom-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './unified-bottom-nav.component.html',
  styleUrl: './unified-bottom-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnifiedBottomNavComponent {
  private readonly router = inject(Router);

  /** User role to determine navigation config */
  readonly role = input<string>('OWNER');

  /** Active tab id */
  readonly activeTab = input<string>('home');

  /** Emitted when FAB button is clicked */
  readonly fabAction = output<void>();

  readonly navConfig = computed<RoleNavConfig>(() => {
    const role = this.role();
    return NAV_CONFIG[role] || NAV_CONFIG['OWNER'];
  });

  readonly navStyle = computed(() => this.navConfig().style);
  readonly showFab = computed(() => this.navConfig().showFab);
  readonly navItems = computed(() => this.navConfig().items);

  readonly leftItems = computed(() => {
    const items = this.navItems();
    return items.slice(0, Math.ceil(items.length / 2));
  });

  readonly rightItems = computed(() => {
    const items = this.navItems();
    return items.slice(Math.ceil(items.length / 2));
  });

  isActive(itemId: string): boolean {
    return this.activeTab() === itemId;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onFabClick(): void {
    this.fabAction.emit();
  }
}
