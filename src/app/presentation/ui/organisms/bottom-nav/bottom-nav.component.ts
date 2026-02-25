import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomNavComponent {
  readonly centerAction = output<void>();

  readonly navItems: NavItem[] = [
    { label: 'Inicio', icon: 'bi-house-door', route: '/home' },
    { label: 'Historial', icon: 'bi-clock-history', route: '/authorization' },
    { label: 'Difusión', icon: 'bi-megaphone', route: '/announcements' },
    { label: 'Más', icon: 'bi-three-dots', route: '/more' }
  ];

  onCenterAction(): void {
    this.centerAction.emit();
  }
}
