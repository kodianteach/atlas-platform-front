import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OnboardingCompleteComponent } from './onboarding-complete.component';

describe('OnboardingCompleteComponent', () => {
  let component: OnboardingCompleteComponent;
  let fixture: ComponentFixture<OnboardingCompleteComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [OnboardingCompleteComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display success title', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('.page-title');
    expect(title.textContent).toBe('Setup Complete!');
  });

  it('should display success subtitle', () => {
    const compiled = fixture.nativeElement;
    const subtitle = compiled.querySelector('.page-subtitle');
    expect(subtitle.textContent).toBe('Your profile and property have been registered successfully.');
  });

  it('should display continue button', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.continue-button');
    expect(button).toBeTruthy();
    expect(button.textContent.trim()).toBe('Continue to Dashboard');
  });

  it('should navigate to home when continue button is clicked', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.continue-button');
    
    button.click();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call navigateToHome when button is clicked', () => {
    spyOn(component, 'navigateToHome');
    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('.continue-button');
    
    button.click();
    
    expect(component.navigateToHome).toHaveBeenCalled();
  });
});
