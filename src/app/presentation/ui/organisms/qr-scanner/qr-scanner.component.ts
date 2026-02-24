import { Component, ChangeDetectionStrategy, input, output, signal, OnDestroy, AfterViewInit, effect, untracked } from '@angular/core';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

/**
 * QR Scanner organism using html5-qrcode with camera.
 * Provides viewfinder with scanning frame, auto-detection, and haptic feedback.
 */
@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrScannerComponent implements AfterViewInit, OnDestroy {
  readonly active = input<boolean>(true);
  readonly qrScanned = output<string>();
  readonly scanError = output<string>();

  readonly scanning = signal(false);
  readonly cameraReady = signal(false);
  readonly lastError = signal<string | null>(null);
  readonly torchOn = signal(false);
  readonly torchAvailable = signal(false);

  private scanner: Html5Qrcode | null = null;
  private readonly scannerId = 'qr-scanner-region';
  private viewReady = false;

  constructor() {
    // Watch active input — only STOP scanner when active becomes false
    effect(() => {
      const isActive = this.active();
      if (!this.viewReady) return;

      const currentlyScanning = untracked(() => this.scanning());
      if (!isActive && currentlyScanning) {
        this.stopScanner();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  async startScanner(): Promise<void> {
    if (this.scanning()) return;

    try {
      await this.requestCameraPermission();
      await this.cleanupPreviousScanner();

      this.scanner = new Html5Qrcode(this.scannerId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false
      });

      await this.tryStartCamera();

      this.scanning.set(true);
      this.cameraReady.set(true);
      this.lastError.set(null);
      this.torchOn.set(false);
      this.checkTorchSupport();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar la cámara';
      console.error('Camera error:', err);
      this.lastError.set(this.humanizeError(message));
      this.scanError.emit(this.lastError()!);
    }
  }

  private async requestCameraPermission(): Promise<void> {
    if (navigator.mediaDevices?.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      stream.getTracks().forEach(track => track.stop());
    }
  }

  private async cleanupPreviousScanner(): Promise<void> {
    if (this.scanner) {
      try {
        await this.scanner.stop();
      } catch {
        // ignore
      }
      this.scanner = null;
    }
  }

  private readonly scanConfig = {
    fps: 15,
    qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
      const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.75;
      return { width: size, height: size };
    }
  };

  private async tryStartCamera(): Promise<void> {
    try {
      await this.scanner!.start(
        { facingMode: 'environment' },
        this.scanConfig,
        (decodedText) => this.onScanSuccess(decodedText),
        () => { /* no QR detected yet */ }
      );
    } catch {
      await this.fallbackToDeviceCamera();
    }
  }

  private async fallbackToDeviceCamera(): Promise<void> {
    const cameras = await Html5Qrcode.getCameras();
    if (!cameras?.length) {
      throw new Error('No se encontraron cámaras disponibles');
    }
    const backCamera = cameras.find(c =>
      /back|rear|trasera|environment/i.test(c.label)
    ) ?? cameras.at(-1)!;

    await this.scanner!.start(
      backCamera.id,
      this.scanConfig,
      (decodedText) => this.onScanSuccess(decodedText),
      () => { /* no QR detected yet */ }
    );
  }

  private humanizeError(message: string): string {
    if (message.includes('NotAllowedError') || message.includes('Permission')) {
      return 'Permiso de cámara denegado. Habilítalo en la configuración del navegador.';
    }
    if (message.includes('NotFoundError') || message.includes('no camera')) {
      return 'No se encontró ninguna cámara en este dispositivo.';
    }
    if (message.includes('NotReadableError') || message.includes('in use')) {
      return 'La cámara está siendo usada por otra aplicación.';
    }
    return message;
  }

  async stopScanner(): Promise<void> {
    if (this.scanner && this.scanning()) {
      try {
        await this.scanner.stop();
      } catch {
        // Ignore stop errors
      }
      this.scanning.set(false);
    }
  }

  async toggleScanner(): Promise<void> {
    if (this.scanning()) {
      await this.stopScanner();
    } else {
      await this.startScanner();
    }
  }

  async toggleTorch(): Promise<void> {
    const track = this.getVideoTrack();
    if (!track) return;

    const newState = !this.torchOn();
    try {
      await track.applyConstraints({ advanced: [{ torch: newState } as MediaTrackConstraintSet] });
      this.torchOn.set(newState);
    } catch {
      console.warn('Torch not supported on this device');
      this.torchAvailable.set(false);
    }
  }

  private checkTorchSupport(): void {
    const track = this.getVideoTrack();
    if (!track) {
      this.torchAvailable.set(false);
      return;
    }
    const capabilities = track.getCapabilities?.() as Record<string, unknown> | undefined;
    this.torchAvailable.set(!!capabilities?.['torch']);
  }

  private getVideoTrack(): MediaStreamTrack | null {
    const videoEl: HTMLVideoElement | null = document.querySelector(`#${this.scannerId} video`);
    return videoEl?.srcObject instanceof MediaStream
      ? videoEl.srcObject.getVideoTracks()[0] ?? null
      : null;
  }

  private onScanSuccess(decodedText: string): void {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }

    // Pause scanner to prevent duplicate reads
    this.stopScanner();
    this.qrScanned.emit(decodedText);
  }
}
