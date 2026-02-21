import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  readonly percentage = input<number>(0);
  readonly color = input<string>('#007bff');
  readonly height = input<string>('8px');

  readonly clampedPercentage = computed(() =>
    Math.max(0, Math.min(100, this.percentage()))
  );
}
