import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { SoundSvc, TimerSound } from '../../services/sound-svc';

interface SoundItem {
  value: TimerSound;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-sound-picker',
  imports: [],
  templateUrl: './sound-picker.html',
  styleUrl: './sound-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundPicker {
  private readonly sound = inject(SoundSvc);

  readonly value = input.required<TimerSound>();
  readonly valueChange = output<TimerSound>();

  readonly previewing = signal<TimerSound | null>(null);

  readonly items: SoundItem[] = [
    { value: 'none', title: 'silent', icon: '🔇' },
    { value: 'ding', title: 'ding', icon: '🔔' },
    { value: 'alarm', title: 'alarm', icon: '🚨' },
  ];

  select(sound: TimerSound) {
    this.valueChange.emit(sound);
  }

  preview(event: MouseEvent, sound: TimerSound) {
    event.stopPropagation();

    this.sound.play(sound);
    this.previewing.set(sound);

    if (sound !== 'alarm') setTimeout(() => {
      if (this.previewing() === sound) {
        this.stopPreview();
      }
    }, 1000);
  }

  stopPreview(event?: MouseEvent) {
    event?.stopPropagation();

    this.sound.stop();
    this.previewing.set(null);
  }
}
