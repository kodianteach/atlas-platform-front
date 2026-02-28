import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UnifiedBottomNavComponent } from './unified-bottom-nav.component';
import { Component } from '@angular/core';

// Host component for testing inputs
@Component({
  standalone: true,
  imports: [UnifiedBottomNavComponent],
  template: `
    <app-unified-bottom-nav
      [role]="role"
      [activeTab]="activeTab"
      (fabAction)="onFab()" />
  `
})
class TestHostComponent {
  role = 'OWNER';
  activeTab = 'home';
  fabClicked = false;
  onFab(): void { this.fabClicked = true; }
}

describe('UnifiedBottomNavComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('OWNER role', () => {
    it('should render pill style navigation', () => {
      const nav = fixture.nativeElement.querySelector('.unified-nav--pill');
      expect(nav).toBeTruthy();
    });

    it('should show FAB button', () => {
      const fab = fixture.nativeElement.querySelector('.unified-nav__fab');
      expect(fab).toBeTruthy();
    });

    it('should show 4 nav items', () => {
      const items = fixture.nativeElement.querySelectorAll('.unified-nav__item');
      expect(items.length).toBe(4);
    });

    it('should emit fabAction when FAB is clicked', () => {
      const fab = fixture.nativeElement.querySelector('.unified-nav__fab');
      fab.click();
      expect(host.fabClicked).toBeTrue();
    });

    it('should show Inicio, Historial, Difusión, Vehículos labels', () => {
      const labels = fixture.nativeElement.querySelectorAll('.unified-nav__label');
      const texts = Array.from(labels).map((el: any) => el.textContent.trim());
      expect(texts).toContain('Inicio');
      expect(texts).toContain('Historial');
      expect(texts).toContain('Difusión');
      expect(texts).toContain('Vehículos');
    });
  });

  describe('ADMIN_ATLAS role', () => {
    beforeEach(() => {
      host.role = 'ADMIN_ATLAS';
      host.activeTab = 'home';
      fixture.detectChanges();
    });

    it('should render flat style navigation', () => {
      const nav = fixture.nativeElement.querySelector('.unified-nav--flat');
      expect(nav).toBeTruthy();
    });

    it('should NOT show FAB button', () => {
      const fab = fixture.nativeElement.querySelector('.unified-nav__fab');
      expect(fab).toBeFalsy();
    });

    it('should show 5 nav items', () => {
      const items = fixture.nativeElement.querySelectorAll('.unified-nav__item');
      expect(items.length).toBe(5);
    });

    it('should show admin-specific labels', () => {
      const labels = fixture.nativeElement.querySelectorAll('.unified-nav__label');
      const texts = Array.from(labels).map((el: any) => el.textContent.trim());
      expect(texts).toContain('Inicio');
      expect(texts).toContain('Unidades');
      expect(texts).toContain('Porteros');
      expect(texts).toContain('Config');
      expect(texts).toContain('Más');
    });

    it('should mark active tab', () => {
      const activeItem = fixture.nativeElement.querySelector('.unified-nav__item--active');
      expect(activeItem).toBeTruthy();
    });
  });

  describe('PORTERO_VIGILANTE role', () => {
    beforeEach(() => {
      host.role = 'PORTERO_VIGILANTE';
      host.activeTab = 'scan';
      fixture.detectChanges();
    });

    it('should render flat style navigation', () => {
      const nav = fixture.nativeElement.querySelector('.unified-nav--flat');
      expect(nav).toBeTruthy();
    });

    it('should NOT show FAB button', () => {
      const fab = fixture.nativeElement.querySelector('.unified-nav__fab');
      expect(fab).toBeFalsy();
    });

    it('should show doorman-specific labels', () => {
      const labels = fixture.nativeElement.querySelectorAll('.unified-nav__label');
      const texts = Array.from(labels).map((el: any) => el.textContent.trim());
      expect(texts).toContain('Escanear');
      expect(texts).toContain('Historial');
      expect(texts).toContain('Más');
    });
  });

  describe('RESIDENT role', () => {
    beforeEach(() => {
      host.role = 'RESIDENT';
      fixture.detectChanges();
    });

    it('should render pill style with FAB same as OWNER', () => {
      const pillNav = fixture.nativeElement.querySelector('.unified-nav--pill');
      const fab = fixture.nativeElement.querySelector('.unified-nav__fab');
      expect(pillNav).toBeTruthy();
      expect(fab).toBeTruthy();
    });
  });

  describe('Unknown role fallback', () => {
    beforeEach(() => {
      host.role = 'UNKNOWN_ROLE';
      fixture.detectChanges();
    });

    it('should default to OWNER config', () => {
      const pillNav = fixture.nativeElement.querySelector('.unified-nav--pill');
      expect(pillNav).toBeTruthy();
    });
  });
});
