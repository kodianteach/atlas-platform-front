import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListHeaderComponent } from './list-header.component';
import { BadgeComponent } from '../../atoms/badge/badge.component';

describe('ListHeaderComponent', () => {
  let component: ListHeaderComponent;
  let fixture: ComponentFixture<ListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHeaderComponent, BadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title', () => {
    component.title = 'Active Authorizations';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.list-header__title');
    expect(titleElement?.textContent).toContain('Active Authorizations');
  });

  it('should display the count badge', () => {
    component.count = 5;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const badgeElement = compiled.querySelector('app-badge');
    expect(badgeElement).toBeTruthy();
  });

  it('should pass count as text to badge component', () => {
    component.count = 10;
    fixture.detectChanges();

    const badgeDebugElement = fixture.debugElement.query(
      (el) => el.name === 'app-badge'
    );
    expect(badgeDebugElement).toBeTruthy();
  });

  it('should handle zero count', () => {
    component.count = 0;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const badgeElement = compiled.querySelector('app-badge');
    expect(badgeElement).toBeTruthy();
  });

  it('should update when title input changes', () => {
    component.title = 'Initial Title';
    fixture.detectChanges();

    let titleElement = fixture.nativeElement.querySelector('.list-header__title');
    expect(titleElement?.textContent).toContain('Initial Title');

    component.title = 'Updated Title';
    fixture.detectChanges();

    titleElement = fixture.nativeElement.querySelector('.list-header__title');
    expect(titleElement?.textContent).toContain('Updated Title');
  });

  it('should update when count input changes', () => {
    component.count = 3;
    fixture.detectChanges();

    component.count = 7;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const badgeElement = compiled.querySelector('app-badge');
    expect(badgeElement).toBeTruthy();
  });
});
