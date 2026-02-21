import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBarComponent } from './progress-bar.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;
  let progressBarElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    progressBarElement = fixture.debugElement.query(By.css('.progress-bar'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default values', () => {
    expect(component.percentage).toBe(0);
    expect(component.color).toBe('#007bff');
    expect(component.height).toBe('8px');
  });

  it('should apply custom height', () => {
    component.height = '12px';
    fixture.detectChanges();
    
    const element = progressBarElement.nativeElement;
    expect(element.style.height).toBe('12px');
  });

  it('should apply custom color to fill', () => {
    component.color = '#ff0000';
    component.percentage = 50;
    fixture.detectChanges();
    
    const fillElement = fixture.debugElement.query(By.css('.progress-bar__fill')).nativeElement;
    expect(fillElement.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('should set width based on percentage', () => {
    component.percentage = 75;
    fixture.detectChanges();
    
    const fillElement = fixture.debugElement.query(By.css('.progress-bar__fill')).nativeElement;
    expect(fillElement.style.width).toBe('75%');
  });

  it('should clamp percentage to 0-100 range', () => {
    component.percentage = 150;
    expect(component.clampedPercentage).toBe(100);
    
    component.percentage = -20;
    expect(component.clampedPercentage).toBe(0);
    
    component.percentage = 50;
    expect(component.clampedPercentage).toBe(50);
  });

  it('should have proper ARIA attributes', () => {
    component.percentage = 60;
    fixture.detectChanges();
    
    const element = progressBarElement.nativeElement;
    expect(element.getAttribute('role')).toBe('progressbar');
    expect(element.getAttribute('aria-valuenow')).toBe('60');
    expect(element.getAttribute('aria-valuemin')).toBe('0');
    expect(element.getAttribute('aria-valuemax')).toBe('100');
    expect(element.getAttribute('aria-label')).toBe('Progress: 60%');
  });

  it('should handle 0% progress', () => {
    component.percentage = 0;
    fixture.detectChanges();
    
    const fillElement = fixture.debugElement.query(By.css('.progress-bar__fill')).nativeElement;
    expect(fillElement.style.width).toBe('0%');
  });

  it('should handle 100% progress', () => {
    component.percentage = 100;
    fixture.detectChanges();
    
    const fillElement = fixture.debugElement.query(By.css('.progress-bar__fill')).nativeElement;
    expect(fillElement.style.width).toBe('100%');
  });

  it('should update dynamically when percentage changes', () => {
    component.percentage = 25;
    fixture.detectChanges();
    
    let fillElement = fixture.debugElement.query(By.css('.progress-bar__fill')).nativeElement;
    expect(fillElement.style.width).toBe('25%');
    
    component.percentage = 75;
    fixture.detectChanges();
    
    fillElement = fixture.debugElement.query(By.css('.progress-bar__fill')).nativeElement;
    expect(fillElement.style.width).toBe('75%');
  });
});
