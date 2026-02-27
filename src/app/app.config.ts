import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { mockApiInterceptor } from '@infrastructure/interceptors/mock-api.interceptor';
import { authInterceptor } from '@infrastructure/interceptors/auth.interceptor';

// Domain Gateways (abstractions)
import { AuthGateway } from '@domain/gateways/auth/auth.gateway';
import { AuthorizationGateway } from '@domain/gateways/authorization/authorization.gateway';
import { AnnouncementGateway } from '@domain/gateways/announcement/announcement.gateway';
import { AdminGateway } from '@domain/gateways/admin/admin.gateway';
import { PropertyGateway } from '@domain/gateways/property/property.gateway';
import { VehicleGateway } from '@domain/gateways/vehicle/vehicle.gateway';
import { EntryGateway } from '@domain/gateways/entry/entry.gateway';
import { StorageGateway } from '@domain/gateways/storage/storage.gateway';
import { ActivationGateway } from '@domain/gateways/activation/activation.gateway';
import { OnboardingGateway } from '@domain/gateways/onboarding/onboarding.gateway';
import { PreRegistrationGateway } from '@domain/gateways/pre-registration/pre-registration.gateway';
import { UnitGateway } from '@domain/gateways/unit/unit.gateway';
import { OrganizationConfigGateway } from '@domain/gateways/organization/organization-config.gateway';
import { PorterGateway } from '@domain/gateways/porter/porter.gateway';
import { InvitationGateway } from '@domain/gateways/invitation/invitation.gateway';
import { EnrollmentGateway } from '@domain/gateways/enrollment/enrollment.gateway';
import { MeGateway } from '@domain/gateways/me/me.gateway';

// Infrastructure Adapters (implementations)
import { AuthAdapter } from '@infrastructure/adapters/auth/auth.adapter';
import { AuthorizationAdapter } from '@infrastructure/adapters/authorization/authorization.adapter';
import { AnnouncementAdapter } from '@infrastructure/adapters/announcement/announcement.adapter';
import { AdminAdapter } from '@infrastructure/adapters/admin/admin.adapter';
import { PropertyAdapter } from '@infrastructure/adapters/property/property.adapter';
import { VehicleAdapter } from '@infrastructure/adapters/vehicle/vehicle.adapter';
import { EntryAdapter } from '@infrastructure/adapters/entry/entry.adapter';
import { StorageAdapter } from '@infrastructure/adapters/storage/storage.adapter';
import { ActivationAdapter } from '@infrastructure/adapters/activation/activation.adapter';
import { OnboardingAdapter } from '@infrastructure/adapters/onboarding/onboarding.adapter';
import { PreRegistrationAdapter } from '@infrastructure/adapters/pre-registration/pre-registration.adapter';
import { UnitAdapter } from '@infrastructure/adapters/unit/unit.adapter';
import { OrganizationConfigAdapter } from '@infrastructure/adapters/organization/organization-config.adapter';
import { PorterAdapter } from '@infrastructure/adapters/porter/porter.adapter';
import { InvitationAdapter } from '@infrastructure/adapters/invitation/invitation.adapter';
import { EnrollmentAdapter } from '@infrastructure/adapters/enrollment/enrollment.adapter';
import { MeAdapter } from '@infrastructure/adapters/me/me.adapter';

/**
 * Factory for ngx-translate HTTP loader
 */
export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, mockApiInterceptor])
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),

    // i18n - Translation module
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),

    // Dependency Inversion: Bind Gateways to Adapters
    { provide: StorageGateway, useClass: StorageAdapter },
    { provide: AuthGateway, useClass: AuthAdapter },
    { provide: AuthorizationGateway, useClass: AuthorizationAdapter },
    { provide: AnnouncementGateway, useClass: AnnouncementAdapter },
    { provide: AdminGateway, useClass: AdminAdapter },
    { provide: PropertyGateway, useClass: PropertyAdapter },
    { provide: VehicleGateway, useClass: VehicleAdapter },
    { provide: EntryGateway, useClass: EntryAdapter },
    { provide: ActivationGateway, useClass: ActivationAdapter },
    { provide: OnboardingGateway, useClass: OnboardingAdapter },
    { provide: PreRegistrationGateway, useClass: PreRegistrationAdapter },
    { provide: UnitGateway, useClass: UnitAdapter },
    { provide: OrganizationConfigGateway, useClass: OrganizationConfigAdapter },
    { provide: PorterGateway, useClass: PorterAdapter },
    { provide: InvitationGateway, useClass: InvitationAdapter },
    { provide: EnrollmentGateway, useClass: EnrollmentAdapter },
    { provide: MeGateway, useClass: MeAdapter },
  ]
};
