import { Routes } from '@angular/router';
import { profileCompletionGuard } from '@infrastructure/guards/profile-completion.guard';
import { authGuard } from '@infrastructure/guards/auth.guard';
import { porterGuard } from '@infrastructure/guards/porter.guard';
import { onboardingGuard } from '@infrastructure/guards/onboarding.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('@presentation/pages/login/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'activate',
    loadComponent: () => import('@presentation/pages/activate/activate-page.component').then(m => m.ActivatePageComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('@presentation/pages/invitation-register/invitation-register-page.component').then(m => m.InvitationRegisterPageComponent)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('@presentation/pages/onboarding/onboarding-page.component').then(m => m.OnboardingPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dev/admin-register',
    loadComponent: () => import('@presentation/pages/dev/admin-register/admin-register-page.component').then(m => m.AdminRegisterPageComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('@presentation/pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [onboardingGuard]
  },
  {
    path: 'authorization',
    loadComponent: () => import('@presentation/pages/authorization/authorization.component').then(m => m.AuthorizationComponent)
  },
  {
    path: 'authorization/:id',
    loadComponent: () => import('@presentation/pages/authorization-detail/authorization-detail.component').then(m => m.AuthorizationDetailComponent)
  },
  {
    path: 'announcements',
    loadComponent: () => import('@presentation/pages/announcements/announcements.component').then(m => m.AnnouncementsComponent)
  },
  {
    path: 'announcements/:id',
    loadComponent: () => import('@presentation/pages/announcement-detail/announcement-detail.component').then(m => m.AnnouncementDetailComponent)
  },
  {
    path: 'access-permissions',
    loadComponent: () => import('@presentation/pages/access-permissions/access-permissions.component').then(m => m.AccessPermissionsComponent)
  },
  {
    path: 'vehicles',
    loadComponent: () => import('@presentation/pages/vehicles/vehicles.component').then(m => m.VehiclesComponent)
  },
  {
    path: 'more',
    loadComponent: () => import('@presentation/pages/owner/more/owner-more-page.component').then(m => m.OwnerMorePageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'doorman',
    children: [
      {
        path: '',
        redirectTo: 'scan',
        pathMatch: 'full'
      },
      {
        path: 'scan',
        loadComponent: () => import('@presentation/pages/doorman/scan/scan-page.component').then(m => m.ScanPageComponent),
        canActivate: [porterGuard]
      },
      {
        path: 'entry-control',
        redirectTo: 'scan',
        pathMatch: 'full'
      },
      {
        path: 'vehicle-exit',
        loadComponent: () => import('@presentation/pages/doorman/vehicle-exit/vehicle-exit-page.component').then(m => m.VehicleExitPageComponent),
        canActivate: [porterGuard]
      },
      {
        path: 'entry-logs',
        loadComponent: () => import('@presentation/pages/doorman/entry-logs/entry-logs.component').then(m => m.EntryLogsComponent),
        canActivate: [porterGuard]
      },
      {
        path: 'admin-chat',
        loadComponent: () => import('@presentation/pages/doorman/admin-chat/admin-chat.component').then(m => m.AdminChatComponent),
        canActivate: [porterGuard]
      },
      {
        path: 'more',
        loadComponent: () => import('@presentation/pages/doorman/more/doorman-more-page.component').then(m => m.DoormanMorePageComponent),
        canActivate: [porterGuard]
      }
    ]
  },
  {
    path: 'owner',
    children: [
      {
        path: 'invite-resident',
        loadComponent: () => import('@presentation/pages/owner/invite-resident/invite-resident-page.component').then(m => m.InviteResidentPageComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'profile-setup',
        loadComponent: () => import('@presentation/pages/admin/profile-setup/profile-setup-page.component').then(m => m.ProfileSetupPageComponent),
        canActivate: [profileCompletionGuard]
      },
      {
        path: 'property-registration',
        loadComponent: () => import('@presentation/pages/admin/property-registration/property-registration-page.component').then(m => m.PropertyRegistrationPageComponent),
        canActivate: [profileCompletionGuard]
      },
      {
        path: 'onboarding/complete',
        loadComponent: () => import('@presentation/pages/admin/onboarding-complete/onboarding-complete.component').then(m => m.OnboardingCompleteComponent)
      },
      {
        path: 'units',
        loadComponent: () => import('@presentation/pages/admin/units/bulk-unit-creation-page.component').then(m => m.BulkUnitCreationPageComponent),
        canActivate: [authGuard]
      },
      {
        path: 'organization-config',
        loadComponent: () => import('@presentation/pages/admin/organization-config/organization-config-page.component').then(m => m.OrganizationConfigPageComponent),
        canActivate: [authGuard]
      },
      {
        path: 'porters',
        loadComponent: () => import('@presentation/pages/admin/porters/porter-management-page.component').then(m => m.PorterManagementPageComponent),
        canActivate: [authGuard]
      },
      {
        path: 'invitations',
        loadComponent: () => import('@presentation/pages/admin/invitations/invitation-management-page.component').then(m => m.InvitationManagementPageComponent),
        canActivate: [authGuard]
      },
      {
        path: 'authorizations',
        loadComponent: () => import('@presentation/pages/admin/authorizations/admin-authorizations-page.component').then(m => m.AdminAuthorizationsPageComponent),
        canActivate: [authGuard]
      },
      {
        path: 'authorizations/:id',
        loadComponent: () => import('@presentation/pages/admin/authorization-detail/admin-authorization-detail-page.component').then(m => m.AdminAuthorizationDetailPageComponent),
        canActivate: [authGuard]
      },
      {
        path: 'communications',
        loadComponent: () => import('@presentation/pages/admin/communications/admin-communications-page.component').then(m => m.AdminCommunicationsPageComponent),
        canActivate: [authGuard]
      },
      {
        path: 'more',
        loadComponent: () => import('@presentation/pages/admin/more/admin-more-page.component').then(m => m.AdminMorePageComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'enroll/:token',
    loadComponent: () => import('@presentation/pages/enrollment/enrollment-page.component').then(m => m.EnrollmentPageComponent)
  },
  {
    path: 'porter-enroll',
    loadComponent: () => import('@presentation/pages/enrollment/enrollment-page.component').then(m => m.EnrollmentPageComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
