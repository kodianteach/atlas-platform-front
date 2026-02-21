import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { Authorization } from '@domain/models/authorization/authorization.model';
import { ListHeaderComponent } from '../../molecules/list-header/list-header.component';
import { AuthorizationItemComponent } from '../../molecules/authorization-item/authorization-item.component';

@Component({
  selector: 'app-authorization-list',
  standalone: true,
  imports: [ListHeaderComponent, AuthorizationItemComponent],
  templateUrl: './authorization-list.component.html',
  styleUrl: './authorization-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationListComponent {
  readonly authorizations = input<Authorization[]>([]);
  readonly activeCount = input<number>(0);
  readonly toggleAuthorization = output<number>();

  readonly isEmpty = computed(() => this.authorizations().length === 0);

  onToggleAuthorization(authorizationId: number): void {
    this.toggleAuthorization.emit(authorizationId);
  }
}
