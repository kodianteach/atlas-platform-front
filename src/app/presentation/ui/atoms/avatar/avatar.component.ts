import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  readonly imageUrl = input<string>('');
  readonly name = input<string>('');
  readonly size = input<'small' | 'medium' | 'large'>('medium');

  readonly imageError = signal(false);

  readonly initials = computed(() => {
    const n = this.name();
    if (!n) return '?';
    const words = n.trim().split(/\s+/);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  });

  onImageError(): void {
    this.imageError.set(true);
  }
}
