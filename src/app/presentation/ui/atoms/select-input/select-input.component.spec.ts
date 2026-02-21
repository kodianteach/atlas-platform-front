import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectInputComponent } from './select-input.component';

describe('SelectInputComponent', () => {
  let component: SelectInputComponent;
  let fixture: ComponentFixture<SelectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit valueChange when selection changes', () => {
    spyOn(component.valueChange, 'emit');
    component.onValueChange('test-value');
    expect(component.valueChange.emit).toHaveBeenCalledWith('test-value');
  });

  it('should emit blur event when input loses focus', () => {
    spyOn(component.blur, 'emit');
    component.onBlur();
    expect(component.blur.emit).toHaveBeenCalled();
  });

  it('should emit focus event when input gains focus', () => {
    spyOn(component.focus, 'emit');
    component.onFocus();
    expect(component.focus.emit).toHaveBeenCalled();
  });
});
