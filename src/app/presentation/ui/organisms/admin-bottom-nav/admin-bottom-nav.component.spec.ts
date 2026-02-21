import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminBottomNavComponent } from './admin-bottom-nav.component';

describe('AdminBottomNavComponent', () => {
  let component: AdminBottomNavComponent;
  let fixture: ComponentFixture<AdminBottomNavComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [AdminBottomNavComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBottomNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /home when home tab is clicked', () => {
    component.navigateTo('home');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to /admin/units when units tab is clicked', () => {
    component.navigateTo('units');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/units']);
  });

  it('should navigate to /admin/organization-config when config tab is clicked', () => {
    component.navigateTo('config');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/organization-config']);
  });

  it('should return true when checking active tab matches', () => {
    expect(component.isActive('home')).toBeTrue();
  });

  it('should return false when checking non-active tab', () => {
    expect(component.isActive('units')).toBeFalse();
  });
});
