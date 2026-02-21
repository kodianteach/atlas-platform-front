/**
 * CryptoStorageService
 * Manages Ed25519 verification key storage using WebCrypto API + IndexedDB.
 * Keys are stored as non-extractable CryptoKey objects in IndexedDB for
 * maximum security — they survive Service Worker cache clears and app updates.
 *
 * Used by the enrollment flow to persist the organization's Ed25519 public key
 * for offline QR code signature verification.
 */
import { Injectable, signal, computed } from '@angular/core';

/** Stored key metadata alongside the CryptoKey */
export interface StoredKeyMetadata {
  keyId: string;
  organizationName: string;
  porterName: string;
  enrolledAt: string;
  maxClockSkewMinutes: number;
}

/** Full record stored in IndexedDB */
interface StoredKeyRecord {
  id: string;
  cryptoKey: CryptoKey;
  jwk: JsonWebKey;
  metadata: StoredKeyMetadata;
}

const DB_NAME = 'atlas-crypto-store';
const DB_VERSION = 1;
const STORE_NAME = 'verification-keys';
const ACTIVE_KEY_ID = 'active-verification-key';

@Injectable({ providedIn: 'root' })
export class CryptoStorageService {

  /** Whether a verification key is stored locally */
  readonly hasStoredKey = signal(false);

  /** The active key metadata (null if no key stored) */
  readonly storedKeyMetadata = signal<StoredKeyMetadata | null>(null);

  /** Whether WebCrypto + IndexedDB are available on this device */
  readonly isSupported = computed(() =>
    typeof crypto !== 'undefined' &&
    typeof crypto.subtle !== 'undefined' &&
    typeof indexedDB !== 'undefined'
  );

  /**
   * Initialize — check if a key is already stored.
   * Call from the enrollment page or app bootstrap.
   */
  async initialize(): Promise<void> {
    if (!this.isSupported()) return;

    try {
      const record = await this.getStoredRecord();
      if (record) {
        this.hasStoredKey.set(true);
        this.storedKeyMetadata.set(record.metadata);
      }
    } catch {
      // IndexedDB access might fail in private browsing
      console.warn('CryptoStorageService: Could not access IndexedDB');
    }
  }

  /**
   * Import an Ed25519 JWK public key via WebCrypto and store it in IndexedDB.
   * @param jwkString JWK JSON string from the enrollment response (verificationKeyJwk)
   * @param metadata Key metadata for display purposes
   * @returns true if stored successfully
   */
  async storeVerificationKey(jwkString: string, metadata: StoredKeyMetadata): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('WebCrypto or IndexedDB not supported on this device');
    }

    try {
      const jwk: JsonWebKey = JSON.parse(jwkString);

      // Import as CryptoKey via WebCrypto API — Ed25519 for signature verification
      const cryptoKey = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'Ed25519' },
        false, // non-extractable for security
        ['verify']
      );

      const record: StoredKeyRecord = {
        id: ACTIVE_KEY_ID,
        cryptoKey,
        jwk, // Keep JWK for potential re-import after browser key store issues
        metadata
      };

      await this.putRecord(record);
      this.hasStoredKey.set(true);
      this.storedKeyMetadata.set(metadata);
      return true;
    } catch (error) {
      console.error('CryptoStorageService: Failed to store verification key', error);
      throw error;
    }
  }

  /**
   * Retrieve the stored CryptoKey for signature verification.
   * @returns CryptoKey or null if not stored
   */
  async getVerificationKey(): Promise<CryptoKey | null> {
    if (!this.isSupported()) return null;

    try {
      const record = await this.getStoredRecord();
      if (!record) return null;

      // CryptoKey might become invalid after browser updates — re-import if needed
      if (record.cryptoKey) {
        return record.cryptoKey;
      }

      // Fallback: re-import from stored JWK
      if (record.jwk) {
        const cryptoKey = await crypto.subtle.importKey(
          'jwk',
          record.jwk,
          { name: 'Ed25519' },
          false,
          ['verify']
        );
        // Update the record with fresh CryptoKey
        record.cryptoKey = cryptoKey;
        await this.putRecord(record);
        return cryptoKey;
      }

      return null;
    } catch (error) {
      console.error('CryptoStorageService: Failed to retrieve verification key', error);
      return null;
    }
  }

  /**
   * Get the stored key ID for QR verification header matching.
   * @returns keyId string or null
   */
  async getKeyId(): Promise<string | null> {
    const record = await this.getStoredRecord();
    return record?.metadata.keyId ?? null;
  }

  /**
   * Clear all stored keys (used on logout or re-enrollment).
   */
  async clearKeys(): Promise<void> {
    try {
      const db = await this.openDatabase();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.clear();
        request.onsuccess = () => {
          this.hasStoredKey.set(false);
          this.storedKeyMetadata.set(null);
          resolve();
        };
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
      });
    } catch {
      this.hasStoredKey.set(false);
      this.storedKeyMetadata.set(null);
    }
  }

  /**
   * Verify a signature using the stored Ed25519 key.
   * @param signature Raw signature bytes (Uint8Array)
   * @param data Data that was signed (Uint8Array)
   * @returns true if signature is valid
   */
  async verifySignature(signature: Uint8Array, data: Uint8Array): Promise<boolean> {
    const key = await this.getVerificationKey();
    if (!key) {
      throw new Error('No verification key stored. Device must be enrolled first.');
    }

    return crypto.subtle.verify(
      { name: 'Ed25519' },
      key,
      signature,
      data
    );
  }

  // ─── Private IndexedDB helpers ─────────────────────────────────

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getStoredRecord(): Promise<StoredKeyRecord | null> {
    const db = await this.openDatabase();
    return new Promise<StoredKeyRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(ACTIVE_KEY_ID);
      request.onsuccess = () => resolve(request.result as StoredKeyRecord | null);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  }

  private async putRecord(record: StoredKeyRecord): Promise<void> {
    const db = await this.openDatabase();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  }
}
