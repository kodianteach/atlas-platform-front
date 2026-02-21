import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { Authorization, SERVICE_TYPE_LABELS } from '@domain/models/authorization/authorization.model';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ToggleSwitchComponent } from '../../atoms/toggle-switch/toggle-switch.component';

@Component({
  selector: 'app-authorization-item',
  standalone: true,
  imports: [IconComponent, ToggleSwitchComponent],
  templateUrl: './authorization-item.component.html',
  styleUrl: './authorization-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationItemComponent {
  readonly authorization = input.required<Authorization>();
  readonly isActive = input<boolean>(false);
  readonly toggle = output<void>();

  readonly serviceTypeLabel = computed(() =>
    SERVICE_TYPE_LABELS[this.authorization().serviceType] ?? this.authorization().serviceType
  );

  readonly validityDisplay = computed(() => {
    const auth = this.authorization();
    const from = new Date(auth.validFrom).toLocaleDateString();
    const to = new Date(auth.validTo).toLocaleDateString();
    return `${from} - ${to}`;
  });

  readonly iconBackgroundClass = computed(() => {
    const status = this.authorization().status;
    return status === 'ACTIVE' ? 'icon-blue' : 'icon-green';
  });

  onToggle(): void {
    this.toggle.emit();
  }
}
