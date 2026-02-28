import { TestBed } from '@angular/core/testing';
import { ThemingService } from './theming.service';
import { OrganizationConfigGateway } from '@domain/gateways/organization/organization-config.gateway';
import { OrganizationConfig } from '@domain/models/organization/organization-config.model';
import { of } from 'rxjs';
import { Result, success, failure } from '@domain/models/common/api-response.model';

describe('ThemingService', () => {
  let service: ThemingService;
  let configGatewaySpy: jasmine.SpyObj<OrganizationConfigGateway>;

  beforeEach(() => {
    configGatewaySpy = jasmine.createSpyObj('OrganizationConfigGateway', ['getConfig', 'saveConfig']);

    TestBed.configureTestingModule({
      providers: [
        ThemingService,
        { provide: OrganizationConfigGateway, useValue: configGatewaySpy }
      ]
    });

    service = TestBed.inject(ThemingService);
    localStorage.clear();
  });

  afterEach(() => {
    service.clearTheme();
    localStorage.clear();
  });

  describe('applyTheme', () => {
    it('should set CSS variables on document root when config has colors', () => {
      const config: OrganizationConfig = {
        maxUnitsPerDistribution: 100,
        enableOwnerPermissionManagement: false,
        dominantColor: '#3366FF',
        secondaryColor: '#66CC99',
        accentColor: '#FF6633'
      };

      service.applyTheme(config);

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--color-primary')).toBe('#3366FF');
      expect(root.style.getPropertyValue('--color-secondary')).toBe('#66CC99');
      expect(root.style.getPropertyValue('--color-accent')).toBe('#FF6633');
    });

    it('should apply default theme when no colors configured', () => {
      const config: OrganizationConfig = {
        maxUnitsPerDistribution: 100,
        enableOwnerPermissionManagement: false
      };

      service.applyTheme(config);

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--color-primary')).toBe('#B01129');
    });

    it('should persist theme data to localStorage', () => {
      const config: OrganizationConfig = {
        maxUnitsPerDistribution: 100,
        enableOwnerPermissionManagement: false,
        dominantColor: '#3366FF',
        secondaryColor: '#66CC99',
        accentColor: '#FF6633'
      };

      service.applyTheme(config);

      const stored = localStorage.getItem('atlas_theme');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.dominantColor).toBe('#3366FF');
    });

    it('should set gradient-primary CSS variable', () => {
      const config: OrganizationConfig = {
        maxUnitsPerDistribution: 100,
        enableOwnerPermissionManagement: false,
        dominantColor: '#3366FF',
        secondaryColor: '#66CC99',
        accentColor: '#FF6633'
      };

      service.applyTheme(config);

      const gradient = document.documentElement.style.getPropertyValue('--gradient-primary');
      expect(gradient).toContain('#3366FF');
      expect(gradient).toContain('linear-gradient');
    });
  });

  describe('applyDefaultTheme', () => {
    it('should set --color-primary to #B01129', () => {
      service.applyDefaultTheme();

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#B01129');
    });

    it('should remove theme from localStorage', () => {
      localStorage.setItem('atlas_theme', JSON.stringify({ dominantColor: '#000' }));

      service.applyDefaultTheme();

      expect(localStorage.getItem('atlas_theme')).toBeNull();
    });
  });

  describe('generateVariations', () => {
    it('should return valid light, dark, and rgb values', () => {
      const result = service.generateVariations('#B01129');

      expect(result.light).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result.dark).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result.rgb).toMatch(/^\d+, \d+, \d+$/);
    });

    it('should generate lighter color for light variation', () => {
      const result = service.generateVariations('#808080');

      // Light should have higher RGB values
      const lightR = parseInt(result.light.slice(1, 3), 16);
      expect(lightR).toBeGreaterThan(128);
    });

    it('should generate darker color for dark variation', () => {
      const result = service.generateVariations('#808080');

      // Dark should have lower RGB values
      const darkR = parseInt(result.dark.slice(1, 3), 16);
      expect(darkR).toBeLessThan(128);
    });
  });

  describe('clearTheme', () => {
    it('should remove all CSS variables from document root', () => {
      service.applyTheme({
        maxUnitsPerDistribution: 100,
        enableOwnerPermissionManagement: false,
        dominantColor: '#3366FF',
        secondaryColor: '#66CC99',
        accentColor: '#FF6633'
      });

      service.clearTheme();

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--color-primary')).toBe('');
      expect(root.style.getPropertyValue('--color-secondary')).toBe('');
      expect(root.style.getPropertyValue('--color-accent')).toBe('');
    });

    it('should remove theme from localStorage', () => {
      localStorage.setItem('atlas_theme', '{}');

      service.clearTheme();

      expect(localStorage.getItem('atlas_theme')).toBeNull();
    });
  });

  describe('loadAndApplyTheme', () => {
    it('should apply theme from gateway when config has branding', () => {
      const config: OrganizationConfig = {
        maxUnitsPerDistribution: 100,
        enableOwnerPermissionManagement: false,
        dominantColor: '#AA0000',
        secondaryColor: '#00AA00',
        accentColor: '#0000AA'
      };
      configGatewaySpy.getConfig.and.returnValue(of(success(config)));

      service.loadAndApplyTheme();

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#AA0000');
    });

    it('should apply default theme when gateway returns failure', () => {
      configGatewaySpy.getConfig.and.returnValue(of(failure({
        code: 'ERROR',
        message: 'Not found',
        timestamp: new Date()
      })));

      service.loadAndApplyTheme();

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#B01129');
    });
  });

  describe('applyThemeFromCache', () => {
    it('should apply theme from localStorage cache', () => {
      localStorage.setItem('atlas_theme', JSON.stringify({
        dominantColor: '#112233',
        secondaryColor: '#445566',
        accentColor: '#778899'
      }));

      service.applyThemeFromCache();

      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#112233');
    });

    it('should do nothing when no cache exists', () => {
      service.applyThemeFromCache();

      // Should not throw and no properties set
      expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('');
    });
  });
});
