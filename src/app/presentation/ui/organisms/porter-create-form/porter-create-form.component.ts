import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreatePorterRequest, PorterType } from '@domain/models/porter/porter.model';

@Component({
  selector: 'app-porter-create-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './porter-create-form.component.html',
  styleUrl: './porter-create-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PorterCreateFormComponent {
  readonly submitForm = output<CreatePorterRequest>();
  readonly cancelForm = output<void>();

  displayName = '';
  porterType: PorterType | '' = '';

  get isValid(): boolean {
    return this.displayName.trim().length > 0 && this.porterType !== '';
  }

  onSubmit(): void {
    if (!this.isValid) return;
    this.submitForm.emit({
      displayName: this.displayName.trim(),
      porterType: this.porterType as PorterType
    });
  }

  onCancel(): void {
    this.cancelForm.emit();
  }
}
