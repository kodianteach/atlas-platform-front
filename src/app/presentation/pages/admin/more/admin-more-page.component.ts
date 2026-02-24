import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../services/authentication.service';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';
import { AdminBottomNavComponent } from '../../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  description: string;
  route?: string;
  action?: string;
  variant?: 'default' | 'danger';
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-admin-more-page',
  standalone: true,
  imports: [AdminBottomNavComponent],
  templateUrl: './admin-more-page.component.html',
  styleUrl: './admin-more-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminMorePageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);
  private readonly storage = inject(StorageGateway);

  readonly userName = signal('Usuario');
  readonly userEmail = signal('');
  readonly userInitial = signal('U');

  readonly sections: MenuSection[] = [
    {
      title: 'Gestión',
      items: [
        {
          id: 'config',
          icon: 'bi-gear',
          label: 'Configuración',
          description: 'Ajustes de la organización',
          route: '/admin/organization-config'
        },
        {
          id: 'authorizations',
          icon: 'bi-shield-check',
          label: 'Autorizaciones',
          description: 'Ver autorizaciones de acceso',
          route: '/admin/authorizations'
        }
      ]
    },
    {
      title: 'Usuarios',
      items: [
        {
          id: 'invitations',
          icon: 'bi-envelope-paper',
          label: 'Invitar Propietarios',
          description: 'Gestionar invitaciones',
          route: '/admin/invitations'
        }
      ]
    },
    {
      title: 'Sesión',
      items: [
        {
          id: 'logout',
          icon: 'bi-box-arrow-right',
          label: 'Cerrar Sesión',
          description: 'Salir de la aplicación',
          action: 'logout',
          variant: 'danger'
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const user = this.storage.getItem<{
      id: string;
      name: string;
      email: string;
    }>('auth_user');

    if (user) {
      this.userName.set(user.name || 'Usuario');
      this.userEmail.set(user.email || '');
      this.userInitial.set(user.name ? user.name.charAt(0).toUpperCase() : 'U');
    }
  }

  onItemClick(item: MenuItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
    } else if (item.action === 'logout') {
      this.logout();
    }
  }

  private logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
