import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';
import { OfflineEventQueueService } from '@infrastructure/services/offline-event-queue.service';
import { EntryGateway } from '@domain/gateways/entry/entry.gateway';
import { AccessEvent } from '@domain/models/entry/entry.model';
import { ConnectionStatusBarComponent } from '../../../ui/atoms/connection-status-bar/connection-status-bar.component';
import { DoormanBottomNavComponent } from '../../../ui/organisms/doorman-bottom-nav/doorman-bottom-nav.component';

/**
 * Vehicle exit registration page.
 * Porter enters vehicle plate and person name, event is logged.
 * Supports offline mode via event queue.
 */
@Component({
  selector: 'app-vehicle-exit-page',
  standalone: true,
  imports: [FormsModule, ConnectionStatusBarComponent, DoormanBottomNavComponent],
  templateUrl: './vehicle-exit-page.component.html',
  styleUrl: './vehicle-exit-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleExitPageComponent {
  private readonly pwaUpdate = inject(PwaUpdateService);
  private readonly eventQueue = inject(OfflineEventQueueService);
  private readonly entryGateway = inject(EntryGateway);
  private readonly router = inject(Router);

  readonly vehiclePlate = signal('');
  readonly personName = signal('');
  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly errorMessage = signal<string | null>(null);

  updatePlate(value: string): void {
    this.vehiclePlate.set(value.toUpperCase());
  }

  updatePersonName(value: string): void {
    this.personName.set(value);
  }

  async onSubmit(): Promise<void> {
    const plate = this.vehiclePlate().trim();
    const name = this.personName().trim();

    if (!plate) {
      this.errorMessage.set('Ingrese la placa del vehículo');
      return;
    }
    if (!name) {
      this.errorMessage.set('Ingrese el nombre de la persona');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    if (this.pwaUpdate.isOnline()) {
      this.entryGateway.registerVehicleExit({ vehiclePlate: plate, personName: name }).subscribe({
        next: () => this.onSuccess(),
        error: (err) => {
          this.errorMessage.set('Error al registrar la salida');
          this.submitting.set(false);
        }
      });
    } else {
      // Offline — queue event locally
      const event: AccessEvent = {
        action: 'EXIT',
        scanResult: 'VALID',
        personName: name,
        vehiclePlate: plate,
        offlineValidated: true,
        scannedAt: new Date().toISOString(),
        syncStatus: 'PENDING'
      };
      await this.eventQueue.enqueue(event);
      this.onSuccess();
    }
  }

  private onSuccess(): void {
    this.submitting.set(false);
    this.success.set(true);
    setTimeout(() => {
      this.success.set(false);
      this.vehiclePlate.set('');
      this.personName.set('');
    }, 3000);
  }
}
