import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BottomNavComponent } from '../../ui/organisms/bottom-nav/bottom-nav.component';
import { AdminBottomNavComponent } from '../../ui/organisms/admin-bottom-nav/admin-bottom-nav.component';
import { QuickActionCardComponent } from '../../ui/molecules/quick-action-card/quick-action-card.component';
import { AuthorizationFormComponent } from '../../ui/organisms/authorization-form/authorization-form.component';
import { NotificationTrayComponent } from '../../ui/organisms/notification-tray/notification-tray.component';
import { Notification } from '@domain/models/notification/notification.model';
import { NotificationService } from '../../../services/notification.service';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BottomNavComponent, AdminBottomNavComponent, QuickActionCardComponent, AuthorizationFormComponent, NotificationTrayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  private readonly storage = inject(StorageGateway);

  readonly showFormOverlay = signal(false);
  readonly showNotificationTray = signal(false);
  readonly unreadCount = signal(0);

  readonly userName = signal('Usuario');
  readonly userEmail = signal('');
  readonly userRole = signal('');
  readonly userRoles = signal<string[]>([]);
  readonly orgName = signal('');
  readonly isAdmin = computed(() => {
    const role = this.userRole();
    return role === 'ADMIN_ATLAS';
  });
  readonly isOwner = computed(() => {
    const role = this.userRole();
    const roles = this.userRoles();
    return role === 'OWNER' || roles.includes('OWNER');
  });
  readonly userInitial = computed(() => {
    const name = this.userName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  });
  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  });

  private subscription?: Subscription;

  ngOnInit(): void {
    this.loadUserData();

    this.subscription = this.notificationService.notifications$.subscribe(notifications => {
      this.unreadCount.set(notifications.filter(n => !n.read).length);
    });
  }

  private loadUserData(): void {
    const user = this.storage.getItem<{
      id: string;
      name: string;
      email: string;
      role: string;
      roles?: string[];
    }>('auth_user');

    if (user) {
      this.userName.set(user.name || 'Usuario');
      this.userEmail.set(user.email || '');
      this.userRole.set(user.role || user.roles?.[0] || '');
      this.userRoles.set(user.roles || []);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onRegisterVisit(): void {
    this.showFormOverlay.set(true);
  }

  onFormCancel(): void {
    this.showFormOverlay.set(false);
  }

  onAuthorizationCreated(_authorization: any): void {
    this.showFormOverlay.set(false);
  }

  onFormError(_errorMessage: string): void {
    // Error handled by the form component toast
  }

  onNoticeBoard(): void {
    this.router.navigate(['/announcements']);
  }

  onRegisterVehicle(): void {
    this.router.navigate(['/vehicles']);
  }

  onMaintenance(): void {
    // Navigate to maintenance
  }

  onManageUnits(): void {
    this.router.navigate(['/admin/units']);
  }

  onOrganizationConfig(): void {
    this.router.navigate(['/admin/organization-config']);
  }

  onInviteResident(): void {
    this.router.navigate(['/owner/invite-resident']);
  }

  onNotificationClick(): void {
    this.showNotificationTray.set(true);
  }

  onNotificationTrayClose(): void {
    this.showNotificationTray.set(false);
  }

  onNotificationSelected(notification: Notification): void {
    // Navigate based on notification type
  }
}
