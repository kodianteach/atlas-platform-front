/**
 * URL Helper Service
 * Provides utilities for URL manipulation, particularly useful for
 * converting localhost URLs to tunneler URLs during local development.
 */
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class UrlHelperService {
  
  /**
   * Replaces the base URL of a given URL with the configured frontendBaseUrl.
   * Useful when backend returns localhost URLs but we need tunneler URLs.
   * 
   * @param url The original URL (possibly with localhost)
   * @returns The URL with the correct base URL
   */
  normalizeUrl(url: string): string {
    if (!url) return url;
    
    const frontendBaseUrl = (environment as any).frontendBaseUrl;
    
    // If no custom base URL configured, return as-is
    if (!frontendBaseUrl) {
      return url;
    }
    
    // Replace common localhost patterns
    const localhostPatterns = [
      'http://localhost:4200',
      'https://localhost:4200',
      'http://127.0.0.1:4200',
      'https://127.0.0.1:4200'
    ];
    
    for (const pattern of localhostPatterns) {
      if (url.startsWith(pattern)) {
        return url.replace(pattern, frontendBaseUrl);
      }
    }
    
    // If URL is a relative path, prepend the base URL
    if (url.startsWith('/')) {
      return `${frontendBaseUrl}${url}`;
    }
    
    return url;
  }

  /**
   * Gets the current frontend base URL
   * Returns the configured frontendBaseUrl or window.location.origin as fallback
   */
  getBaseUrl(): string {
    const frontendBaseUrl = (environment as any).frontendBaseUrl;
    return frontendBaseUrl || window.location.origin;
  }

  /**
   * Builds a full URL from a path using the configured base URL
   */
  buildUrl(path: string): string {
    const baseUrl = this.getBaseUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
}
