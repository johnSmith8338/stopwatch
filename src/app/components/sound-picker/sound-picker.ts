import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimerSound } from '../../services/sound-svc';

@Component({
  selector: 'app-sound-picker',
  imports: [],
  templateUrl: './sound-picker.html',
  styleUrl: './sound-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundPicker {
  readonly value = input.required<TimerSound>();
  readonly valueChange = output<TimerSound>();

  readonly items: TimerSound[] = ['none', 'ding', 'alarm'];

  onChange(event: Event) {
    this.valueChange.emit(
      (event.target as HTMLSelectElement).value as TimerSound
    )
  }
}
