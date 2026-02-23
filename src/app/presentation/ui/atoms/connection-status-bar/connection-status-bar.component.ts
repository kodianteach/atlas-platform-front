import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';

/**
 * Connection status bar — shows OFFLINE (amber) or ONLINE (green).
 */
@Component({
  selector: 'app-connection-status-bar',
  standalone: true,
  template: `
    <div class="status-bar" [class.online]="pwaUpdate.isOnline()" [class.offline]="!pwaUpdate.isOnline()">
      @if (pwaUpdate.isOnline()) {
        <i class="bi bi-wifi"></i>
        <span>Conectado</span>
      } @else {
        <i class="bi bi-wifi-off"></i>
        <span>Modo Offline</span>
      }
    </div>
  `,
  styles: [`
    .status-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.35rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .online {
      background: #d1fae5;
      color: #065f46;
    }

    .offline {
      background: #fef3c7;
      color: #92400e;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionStatusBarComponent {
  readonly pwaUpdate = inject(PwaUpdateService);
}
