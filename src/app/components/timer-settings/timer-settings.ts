import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimerSound } from '../../services/sound-svc';
import { TimerColor } from '../../constants/colors';
import { TimerIcon } from '../../constants/icons';
import { SoundPicker } from "../sound-picker/sound-picker";

@Component({
  selector: 'app-timer-settings',
  imports: [SoundPicker],
  templateUrl: './timer-settings.html',
  styleUrl: './timer-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerSettings {
  readonly sound = input.required<TimerSound>();
  readonly color = input.required<TimerColor>();
  readonly icon = input.required<TimerIcon>();

  readonly soundChange = output<TimerSound>();
  readonly colorChange = output<TimerColor>();
  readonly iconChange = output<TimerIcon>();
}
