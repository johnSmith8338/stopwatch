import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
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

  readonly items: SoundItem[] = [
    { value: 'inherit', title: 'use default', icon: '' },
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
    if (sound !== 'alarm') setTimeout(() => { this.sound.stop() }, 1000);
  }
}
