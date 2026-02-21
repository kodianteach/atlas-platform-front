import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrantAuthorizationCardComponent } from './grant-authorization-card.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ButtonComponent } from '../../atoms/button/button.component';

describe('GrantAuthorizationCardComponent', () => {
  let component: GrantAuthorizationCardComponent;
  let fixture: ComponentFixture<GrantAuthorizationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrantAuthorizationCardComponent, IconComponent, ButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantAuthorizationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title input', () => {
    component.title = 'Grant New Authorization';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.grant-card__title');
    
    expect(titleElement?.textContent).toContain('Grant New Authorization');
  });

  it('should display description input', () => {
    component.description = 'Create access permissions for visitors';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const descriptionElement = compiled.querySelector('.grant-card__description');
    
    expect(descriptionElement?.textContent).toContain('Create access permissions for visitors');
  });

  it('should pass icon to IconComponent', () => {
    component.icon = 'key';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const iconElement = compiled.querySelector('app-icon');
    
    expect(iconElement).toBeTruthy();
  });

  it('should emit createClick event when button is clicked', () => {
    spyOn(component.createClick, 'emit');
    
    component.onCreateClick();
    
    expect(component.createClick.emit).toHaveBeenCalled();
  });

  it('should render ButtonComponent with correct label', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElement = compiled.querySelector('app-button');
    
    expect(buttonElement).toBeTruthy();
  });

  it('should have proper ARIA label on button', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElement = compiled.querySelector('app-button');
    
    expect(buttonElement?.getAttribute('aria-label')).toBe('Create new authorization pass');
  });

  it('should compose IconAtom, text elements, and ButtonAtom', () => {
    component.title = 'Test Title';
    component.description = 'Test Description';
    component.icon = 'test-icon';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for IconAtom
    expect(compiled.querySelector('app-icon')).toBeTruthy();
    
    // Check for text elements
    expect(compiled.querySelector('.grant-card__title')).toBeTruthy();
    expect(compiled.querySelector('.grant-card__description')).toBeTruthy();
    
    // Check for ButtonAtom
    expect(compiled.querySelector('app-button')).toBeTruthy();
  });
});
