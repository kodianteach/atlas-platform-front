  import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationContainerComponent } from '@presentation/ui/organisms/notification-container/notification-container.component';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';
import { PwaInstallBannerComponent } from '@presentation/ui/organisms/pwa-install-banner/pwa-install-banner.component';
import { PwaUpdateBannerComponent } from '@presentation/ui/organisms/pwa-update-banner/pwa-update-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationContainerComponent, PwaInstallBannerComponent, PwaUpdateBannerComponent],
  template: `
    <app-notification-container />
    <app-pwa-update-banner />
    <app-pwa-install-banner />
    <router-outlet />
  `,
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly translate = inject(TranslateService);
  private readonly pwaUpdate = inject(PwaUpdateService);

  constructor() {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.pwaUpdate.initialize();
  }
}
