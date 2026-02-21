import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AuthTemplateComponent } from './auth-template.component';

@Component({
  standalone: true,
  imports: [AuthTemplateComponent],
  template: `
    <app-auth-template [title]="title" [subtitle]="subtitle">
      <p class="test-content">Projected content</p>
    </app-auth-template>
  `
})
class TestHostComponent {
  title = 'Test Title';
  subtitle = 'Test Subtitle';
}

describe('AuthTemplateComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should render the logo', () => {
    const logo = fixture.nativeElement.querySelector('.logo-circle');
    expect(logo).toBeTruthy();
  });

  it('should render the brand title', () => {
    const brandTitle = fixture.nativeElement.querySelector('.brand-title');
    expect(brandTitle.textContent).toContain('Atlas Platform');
  });

  it('should render the card title', () => {
    const cardTitle = fixture.nativeElement.querySelector('.card-title');
    expect(cardTitle.textContent).toContain('Test Title');
  });

  it('should render the card subtitle', () => {
    const cardSubtitle = fixture.nativeElement.querySelector('.card-subtitle');
    expect(cardSubtitle.textContent).toContain('Test Subtitle');
  });

  it('should project ng-content', () => {
    const content = fixture.nativeElement.querySelector('.test-content');
    expect(content).toBeTruthy();
    expect(content.textContent).toContain('Projected content');
  });

  it('should not render card-header-custom when no title', () => {
    hostComponent.title = '';
    fixture.detectChanges();
    const cardHeader = fixture.nativeElement.querySelector('.card-header-custom');
    expect(cardHeader).toBeNull();
  });
});
