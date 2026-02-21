import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render text input', () => {
    component.text = 'Urgent';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.badge')?.textContent?.trim()).toBe('Urgent');
  });

  it('should apply urgent variant class', () => {
    component.text = 'Urgent';
    component.variant = 'urgent';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.badge');
    expect(badge?.classList.contains('badge-urgent')).toBe(true);
  });

  it('should apply info variant class by default', () => {
    component.text = 'Info';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.badge');
    expect(badge?.classList.contains('badge-info')).toBe(true);
  });

  it('should apply success variant class', () => {
    component.text = 'Success';
    component.variant = 'success';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.badge');
    expect(badge?.classList.contains('badge-success')).toBe(true);
  });

  it('should have aria-label for urgent variant', () => {
    component.text = 'Urgent';
    component.variant = 'urgent';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.badge');
    expect(badge?.getAttribute('aria-label')).toBe('Urgent announcement');
  });

  it('should have aria-label with text for non-urgent variants', () => {
    component.text = 'Info Message';
    component.variant = 'info';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('.badge');
    expect(badge?.getAttribute('aria-label')).toBe('Info Message');
  });
});
