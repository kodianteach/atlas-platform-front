import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/**
 * Badge showing pending offline events count with pulse animation.
 */
@Component({
  selector: 'app-sync-status-badge',
  standalone: true,
  template: `
    @if (pendingCount() > 0) {
      <span class="sync-badge" [class.pulsing]="pendingCount() > 0">
        {{ pendingCount() }}
      </span>
    }
  `,
  styles: [`
    .sync-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 10px;
      background: #f59e0b;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .pulsing {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SyncStatusBadgeComponent {
  readonly pendingCount = input<number>(0);
}
