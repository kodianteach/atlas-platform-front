import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Image rendering', () => {
    it('should render image when imageUrl is provided', () => {
      component.imageUrl = 'https://example.com/avatar.jpg';
      component.name = 'John Doe';
      fixture.detectChanges();

      const img = compiled.querySelector('.avatar__image') as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.src).toBe('https://example.com/avatar.jpg');
      expect(img.alt).toBe('John Doe');
    });

    it('should apply lazy loading to images', () => {
      component.imageUrl = 'https://example.com/avatar.jpg';
      fixture.detectChanges();

      const img = compiled.querySelector('.avatar__image') as HTMLImageElement;
      expect(img.loading).toBe('lazy');
    });

    it('should show placeholder when imageUrl is empty', () => {
      component.imageUrl = '';
      component.name = 'John Doe';
      fixture.detectChanges();

      const placeholder = compiled.querySelector('.avatar__placeholder');
      expect(placeholder).toBeTruthy();
      expect(placeholder?.textContent?.trim()).toBe('JD');
    });

    it('should show placeholder when image fails to load', () => {
      component.imageUrl = 'https://example.com/invalid.jpg';
      component.name = 'Jane Smith';
      fixture.detectChanges();

      const img = compiled.querySelector('.avatar__image') as HTMLImageElement;
      expect(img).toBeTruthy();

      // Simulate image error
      component.onImageError();
      fixture.detectChanges();

      const placeholder = compiled.querySelector('.avatar__placeholder');
      expect(placeholder).toBeTruthy();
      expect(placeholder?.textContent?.trim()).toBe('JS');
    });
  });

  describe('Size variants', () => {
    it('should apply small size class', () => {
      component.size = 'small';
      fixture.detectChanges();

      const avatar = compiled.querySelector('.avatar');
      expect(avatar?.classList.contains('avatar--small')).toBe(true);
    });

    it('should apply medium size class by default', () => {
      fixture.detectChanges();

      const avatar = compiled.querySelector('.avatar');
      expect(avatar?.classList.contains('avatar--medium')).toBe(true);
    });

    it('should apply large size class', () => {
      component.size = 'large';
      fixture.detectChanges();

      const avatar = compiled.querySelector('.avatar');
      expect(avatar?.classList.contains('avatar--large')).toBe(true);
    });
  });

  describe('Initials generation', () => {
    it('should generate initials from first and last name', () => {
      component.name = 'John Doe';
      expect(component.initials).toBe('JD');
    });

    it('should generate single initial from single name', () => {
      component.name = 'John';
      expect(component.initials).toBe('J');
    });

    it('should generate initials from first and last name when multiple words', () => {
      component.name = 'John Michael Doe';
      expect(component.initials).toBe('JD');
    });

    it('should return ? when name is empty', () => {
      component.name = '';
      expect(component.initials).toBe('?');
    });

    it('should handle names with extra whitespace', () => {
      component.name = '  John   Doe  ';
      expect(component.initials).toBe('JD');
    });

    it('should uppercase initials', () => {
      component.name = 'john doe';
      expect(component.initials).toBe('JD');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label with user name', () => {
      component.name = 'John Doe';
      fixture.detectChanges();

      const avatar = compiled.querySelector('.avatar');
      expect(avatar?.getAttribute('aria-label')).toBe('John Doe');
    });

    it('should have default aria-label when name is empty', () => {
      component.name = '';
      fixture.detectChanges();

      const avatar = compiled.querySelector('.avatar');
      expect(avatar?.getAttribute('aria-label')).toBe('User avatar');
    });

    it('should have alt text on image', () => {
      component.imageUrl = 'https://example.com/avatar.jpg';
      component.name = 'John Doe';
      fixture.detectChanges();

      const img = compiled.querySelector('.avatar__image') as HTMLImageElement;
      expect(img.alt).toBe('John Doe');
    });

    it('should have aria-label on placeholder with initials description', () => {
      component.imageUrl = '';
      component.name = 'John Doe';
      fixture.detectChanges();

      const placeholder = compiled.querySelector('.avatar__placeholder');
      expect(placeholder?.getAttribute('aria-label')).toBe('John Doe initials');
    });
  });
});
