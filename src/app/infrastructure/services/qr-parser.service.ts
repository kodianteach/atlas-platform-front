import { Injectable } from '@angular/core';
import { ParsedQr, QrPayload } from '@domain/models/entry/entry.model';

/**
 * Compact QR key mapping (backend uses short keys to reduce QR density):
 *   a=authId, o=orgId, u=unitCode, n=personName, d=personDoc,
 *   s=serviceType, f=validFrom(epoch), t=validTo(epoch),
 *   p=vehiclePlate, k=kid
 */
interface CompactQrPayload {
  a: number;       // authId
  o: number;       // orgId
  u?: string;      // unitCode
  n?: string;      // personName
  d?: string;      // personDoc
  s?: string;      // serviceType
  f?: number;       // validFrom (epoch seconds)
  t?: number;       // validTo (epoch seconds)
  p?: string;      // vehiclePlate
  c?: string;      // vehicleColor
  y?: string;      // vehicleType
  k?: string;      // kid
  // Legacy long keys (backward compat)
  authId?: number;
  orgId?: number;
  unitCode?: string;
  personName?: string;
  personDoc?: string;
  serviceType?: string;
  validFrom?: string;
  validTo?: string;
  vehiclePlate?: string;
  vehicleType?: string;
  vehicleColor?: string;
  issuedAt?: string;
  kid?: string;
}

@Injectable({ providedIn: 'root' })
export class QrParserService {

  parse(rawQrString: string): ParsedQr | null {
    const input = rawQrString?.trim();

    if (!input?.includes('.')) {
      console.warn('[QR Parser] No dot separator found in QR content:', input?.substring(0, 50));
      return null;
    }

    // Split only on the LAST dot (payload.signature)
    const lastDot = input.lastIndexOf('.');
    const payloadPart = input.substring(0, lastDot);
    const signaturePart = input.substring(lastDot + 1);

    if (!payloadPart || !signaturePart) {
      console.warn('[QR Parser] Empty payload or signature after split');
      return null;
    }

    try {
      const payloadJson = this.base64UrlDecodeUtf8(payloadPart);
      console.log('[QR Parser] Decoded payload:', payloadJson.substring(0, 120));
      const raw: CompactQrPayload = JSON.parse(payloadJson);

      const payload = this.mapToQrPayload(raw);

      if (payload.authId == null || payload.orgId == null || !payload.validFrom || !payload.validTo) {
        console.warn('[QR Parser] Missing required fields:', {
          authId: payload.authId, orgId: payload.orgId,
          validFrom: payload.validFrom, validTo: payload.validTo
        });
        return null;
      }

      const signatureBytes = this.base64UrlToUint8Array(signaturePart);

      return { payload, signatureBytes, rawPayloadBase64: payloadPart };
    } catch (err) {
      console.warn('[QR Parser] Parse error:', err, 'Input start:', input.substring(0, 80));
      return null;
    }
  }

  /**
   * Maps compact keys (from new QRs) or legacy long keys to the QrPayload model.
   */
  private mapToQrPayload(raw: CompactQrPayload): QrPayload {
    const authId = raw.a ?? raw.authId ?? 0;
    const orgId = raw.o ?? raw.orgId ?? 0;

    // Dates: compact format uses epoch seconds (number), legacy uses ISO string
    let validFrom: string;
    let validTo: string;

    if (typeof raw.f === 'number') {
      validFrom = new Date(raw.f * 1000).toISOString();
    } else {
      validFrom = raw.validFrom ?? '';
    }

    if (typeof raw.t === 'number') {
      validTo = new Date(raw.t * 1000).toISOString();
    } else {
      validTo = raw.validTo ?? '';
    }

    return {
      authId,
      orgId,
      unitCode: raw.u ?? raw.unitCode ?? '',
      personName: raw.n ?? raw.personName ?? '',
      personDoc: raw.d ?? raw.personDoc ?? '',
      serviceType: raw.s ?? raw.serviceType ?? '',
      validFrom,
      validTo,
      vehiclePlate: raw.p ?? raw.vehiclePlate,
      vehicleType: raw.y ?? raw.vehicleType,
      vehicleColor: raw.c ?? raw.vehicleColor,
      issuedAt: raw.issuedAt ?? '',
      kid: raw.k ?? raw.kid ?? ''
    };
  }

  /**
   * Proper UTF-8 aware base64url decoding.
   */
  private base64UrlDecodeUtf8(base64Url: string): string {
    const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const binaryString = atob(padded);

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.codePointAt(i) ?? 0;
    }
    return new TextDecoder('utf-8').decode(bytes);
  }

  private base64UrlToUint8Array(base64Url: string): Uint8Array {
    const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const raw = atob(padded);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw.codePointAt(i) ?? 0;
    }
    return bytes;
  }
}
