import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PwaInstallModalComponent } from './pwa-install-modal.component';
import { PwaUpdateService } from '@infrastructure/services/pwa-update.service';
import { signal } from '@angular/core';

describe('PwaInstallModalComponent', () => {
  let component: PwaInstallModalComponent;
  let fixture: ComponentFixture<PwaInstallModalComponent>;
  let pwaUpdateService: jasmine.SpyObj<PwaUpdateService>;

  beforeEach(() => {
    pwaUpdateService = jasmine.createSpyObj('PwaUpdateService', ['promptInstall'], {
      canInstall: signal(true),
      isInstalled: signal(false),
      isOnline: signal(true),
      updateAvailable: signal(false)
    });
    pwaUpdateService.promptInstall.and.returnValue(Promise.resolve(false));

    TestBed.configureTestingModule({
      imports: [PwaInstallModalComponent],
      providers: [
        { provide: PwaUpdateService, useValue: pwaUpdateService }
      ]
    });

    fixture = TestBed.createComponent(PwaInstallModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show install button when canInstall is true', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-install')).toBeTruthy();
  });

  it('should not show installed message when not installed', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.installed-message')).toBeFalsy();
  });

  it('should call promptInstall on install click', async () => {
    pwaUpdateService.promptInstall.and.returnValue(Promise.resolve(false));
    await component.install();
    expect(pwaUpdateService.promptInstall).toHaveBeenCalled();
  });

  it('should emit dismiss when install is accepted', async () => {
    pwaUpdateService.promptInstall.and.returnValue(Promise.resolve(true));
    spyOn(component.dismiss, 'emit');
    await component.install();
    expect(component.dismiss.emit).toHaveBeenCalled();
  });

  it('should not emit dismiss when install is declined', async () => {
    pwaUpdateService.promptInstall.and.returnValue(Promise.resolve(false));
    spyOn(component.dismiss, 'emit');
    await component.install();
    expect(component.dismiss.emit).not.toHaveBeenCalled();
  });

  it('should emit dismiss on skip', () => {
    spyOn(component.dismiss, 'emit');
    component.skip();
    expect(component.dismiss.emit).toHaveBeenCalled();
  });

  it('should always show skip button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.btn-skip')).toBeTruthy();
  });
});
