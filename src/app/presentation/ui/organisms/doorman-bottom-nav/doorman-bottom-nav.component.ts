import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doorman-bottom-nav',
  standalone: true,
  templateUrl: './doorman-bottom-nav.component.html',
  styleUrl: './doorman-bottom-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoormanBottomNavComponent {
  private readonly router = inject(Router);

  readonly activeTab = input<'scan' | 'history' | 'residents' | 'more'>('scan');

  navigateTo(tab: string): void {
    const routes: Record<string, string> = {
      scan: '/doorman/entry-control',
      history: '/doorman/entry-logs',
      residents: '/doorman/admin-chat'
    };
    const route = routes[tab];
    if (route) {
      this.router.navigate([route]);
    }
  }

  isActive(tab: string): boolean {
    return this.activeTab() === tab;
  }
}
