/**
 * ThemingService - Dynamic organization theming via CSS Variables
 *
 * Applies organization branding colors to the platform following the 60/30/10 rule:
 * - Dominant (60%): backgrounds, surfaces, main containers
 * - Secondary (30%): bars, cards, sections, navigation
 * - Accent (10%): CTAs, links, indicators, badges
 *
 * Persists theme in localStorage for instant apply on page load.
 * Falls back to default colors (#FF8C61) when no branding is configured.
 */
import { Injectable, inject } from '@angular/core';
import { OrganizationConfigGateway } from '@domain/gateways/organization/organization-config.gateway';
import { OrganizationConfig } from '@domain/models/organization/organization-config.model';

export interface ColorVariations {
  light: string;
  dark: string;
  rgb: string;
}

interface ThemeData {
  dominantColor: string;
  secondaryColor: string;
  accentColor: string;
  logoBase64?: string;
  logoContentType?: string;
}

@Injectable({ providedIn: 'root' })
export class ThemingService {

  private static readonly STORAGE_KEY = 'atlas_theme';
  private static readonly DEFAULT_PRIMARY = '#FF8C61';
  private static readonly DEFAULT_PRIMARY_LIGHT = '#FFB399';
  private static readonly DEFAULT_PRIMARY_DARK = '#FF6B3D';
  private static readonly DEFAULT_PRIMARY_RGB = '255, 140, 97';

  private readonly configGateway = inject(OrganizationConfigGateway);

  /**
   * Apply theme from an OrganizationConfig object
   */
  applyTheme(config: OrganizationConfig): void {
    if (!config.dominantColor && !config.secondaryColor && !config.accentColor) {
      this.applyDefaultTheme();
      return;
    }

    const dominant = config.dominantColor || ThemingService.DEFAULT_PRIMARY;
    const secondary = config.secondaryColor || this.generateVariation(dominant, 20);
    const accent = config.accentColor || this.generateVariation(dominant, -15);

    const dominantVars = this.generateVariations(dominant);
    const secondaryVars = this.generateVariations(secondary);
    const accentVars = this.generateVariations(accent);

    const root = document.documentElement;

    // Primary (dominant - 60%)
    root.style.setProperty('--color-primary', dominant);
    root.style.setProperty('--color-primary-light', dominantVars.light);
    root.style.setProperty('--color-primary-dark', dominantVars.dark);
    root.style.setProperty('--color-primary-rgb', dominantVars.rgb);
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${dominant} 0%, ${dominantVars.light} 100%)`);

    // Secondary (30%)
    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--color-secondary-light', secondaryVars.light);
    root.style.setProperty('--color-secondary-dark', secondaryVars.dark);
    root.style.setProperty('--color-secondary-rgb', secondaryVars.rgb);

    // Accent (10%)
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-accent-light', accentVars.light);
    root.style.setProperty('--color-accent-dark', accentVars.dark);
    root.style.setProperty('--color-accent-rgb', accentVars.rgb);

    // Derived utility variables
    root.style.setProperty('--color-primary-bg', `rgba(${dominantVars.rgb}, 0.08)`);
    root.style.setProperty('--color-primary-hover', `rgba(${dominantVars.rgb}, 0.12)`);
    root.style.setProperty('--color-primary-border', `rgba(${dominantVars.rgb}, 0.2)`);

    // Persist to localStorage
    const themeData: ThemeData = {
      dominantColor: dominant,
      secondaryColor: secondary,
      accentColor: accent,
      logoBase64: config.logoBase64,
      logoContentType: config.logoContentType
    };
    localStorage.setItem(ThemingService.STORAGE_KEY, JSON.stringify(themeData));
  }

  /**
   * Apply default system colors (naranja coral #FF8C61)
   */
  applyDefaultTheme(): void {
    const root = document.documentElement;

    root.style.setProperty('--color-primary', ThemingService.DEFAULT_PRIMARY);
    root.style.setProperty('--color-primary-light', ThemingService.DEFAULT_PRIMARY_LIGHT);
    root.style.setProperty('--color-primary-dark', ThemingService.DEFAULT_PRIMARY_DARK);
    root.style.setProperty('--color-primary-rgb', ThemingService.DEFAULT_PRIMARY_RGB);
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${ThemingService.DEFAULT_PRIMARY} 0%, ${ThemingService.DEFAULT_PRIMARY_LIGHT} 100%)`);

    root.style.setProperty('--color-secondary', '#6c757d');
    root.style.setProperty('--color-secondary-light', '#adb5bd');
    root.style.setProperty('--color-secondary-dark', '#495057');
    root.style.setProperty('--color-secondary-rgb', '108, 117, 125');

    root.style.setProperty('--color-accent', ThemingService.DEFAULT_PRIMARY);
    root.style.setProperty('--color-accent-light', ThemingService.DEFAULT_PRIMARY_LIGHT);
    root.style.setProperty('--color-accent-dark', ThemingService.DEFAULT_PRIMARY_DARK);
    root.style.setProperty('--color-accent-rgb', ThemingService.DEFAULT_PRIMARY_RGB);

    root.style.setProperty('--color-primary-bg', `rgba(${ThemingService.DEFAULT_PRIMARY_RGB}, 0.08)`);
    root.style.setProperty('--color-primary-hover', `rgba(${ThemingService.DEFAULT_PRIMARY_RGB}, 0.12)`);
    root.style.setProperty('--color-primary-border', `rgba(${ThemingService.DEFAULT_PRIMARY_RGB}, 0.2)`);

    localStorage.removeItem(ThemingService.STORAGE_KEY);
  }

  /**
   * Load branding from backend and apply theme. Called after login.
   */
  loadAndApplyTheme(): void {
    this.configGateway.getConfig().subscribe({
      next: (result) => {
        if (result.success && result.data) {
          this.applyTheme(result.data);
        } else {
          this.applyDefaultTheme();
        }
      },
      error: () => {
        this.applyDefaultTheme();
      }
    });
  }

  /**
   * Apply theme from localStorage cache (for instant load without HTTP)
   */
  applyThemeFromCache(): void {
    const cached = localStorage.getItem(ThemingService.STORAGE_KEY);
    if (!cached) {
      return;
    }

    try {
      const themeData: ThemeData = JSON.parse(cached);
      this.applyTheme({
        maxUnitsPerDistribution: 0,
        enableOwnerPermissionManagement: false,
        dominantColor: themeData.dominantColor,
        secondaryColor: themeData.secondaryColor,
        accentColor: themeData.accentColor,
        logoBase64: themeData.logoBase64,
        logoContentType: themeData.logoContentType
      });
    } catch {
      // Invalid cache, ignore
    }
  }

  /**
   * Clear theme and localStorage (for logout)
   */
  clearTheme(): void {
    const root = document.documentElement;

    const properties = [
      '--color-primary', '--color-primary-light', '--color-primary-dark', '--color-primary-rgb',
      '--gradient-primary',
      '--color-secondary', '--color-secondary-light', '--color-secondary-dark', '--color-secondary-rgb',
      '--color-accent', '--color-accent-light', '--color-accent-dark', '--color-accent-rgb',
      '--color-primary-bg', '--color-primary-hover', '--color-primary-border'
    ];

    properties.forEach(prop => root.style.removeProperty(prop));
    localStorage.removeItem(ThemingService.STORAGE_KEY);
  }

  /**
   * Generate light, dark and RGB variations from a hex color
   */
  generateVariations(hexColor: string): ColorVariations {
    const rgb = this.hexToRgb(hexColor);

    return {
      light: this.adjustBrightness(rgb, 30),
      dark: this.adjustBrightness(rgb, -20),
      rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`
    };
  }

  /**
   * Get cached theme data (logo info)
   */
  getCachedTheme(): ThemeData | null {
    const cached = localStorage.getItem(ThemingService.STORAGE_KEY);
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return { r: 128, g: 128, b: 128 };
    }
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }

  private adjustBrightness(rgb: { r: number; g: number; b: number }, percent: number): string {
    const factor = percent / 100;
    const adjust = (value: number) => {
      if (factor > 0) {
        return Math.round(value + (255 - value) * factor);
      }
      return Math.round(value * (1 + factor));
    };

    const r = Math.max(0, Math.min(255, adjust(rgb.r)));
    const g = Math.max(0, Math.min(255, adjust(rgb.g)));
    const b = Math.max(0, Math.min(255, adjust(rgb.b)));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  }

  private generateVariation(baseHex: string, brightnessPercent: number): string {
    const rgb = this.hexToRgb(baseHex);
    return this.adjustBrightness(rgb, brightnessPercent);
  }
}
