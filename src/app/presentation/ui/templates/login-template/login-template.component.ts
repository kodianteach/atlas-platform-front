import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoginFormComponent, LoginFormData } from '../../organisms/login-form/login-form.component';

@Component({
  selector: 'app-login-template',
  standalone: true,
  imports: [LoginFormComponent, TranslateModule],
  templateUrl: './login-template.component.html',
  styleUrl: './login-template.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginTemplateComponent {
  readonly isSubmitting = input<boolean>(false);
  readonly generalError = input<string | undefined>(undefined);
  readonly submitForm = output<LoginFormData>();

  onSubmit(formData: LoginFormData): void {
    this.submitForm.emit(formData);
  }
}
