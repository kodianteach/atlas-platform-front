import { Injectable, inject } from '@angular/core';
import { CryptoStorageService } from './crypto-storage.service';

@Injectable({ providedIn: 'root' })
export class Ed25519VerificationService {

  private readonly cryptoStorage = inject(CryptoStorageService);

  async verify(payloadBytes: Uint8Array, signatureBytes: Uint8Array): Promise<boolean> {
    try {
      return await this.cryptoStorage.verifySignature(signatureBytes, payloadBytes);
    } catch {
      return false;
    }
  }

  isDateInRange(validFrom: string, validTo: string, maxClockSkewMinutes = 10): boolean {
    const now = Date.now();
    const from = new Date(validFrom).getTime() - maxClockSkewMinutes * 60 * 1000;
    const to = new Date(validTo).getTime() + maxClockSkewMinutes * 60 * 1000;
    return now >= from && now <= to;
  }
}
