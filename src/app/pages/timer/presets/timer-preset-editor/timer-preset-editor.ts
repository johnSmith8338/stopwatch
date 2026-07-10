import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { TimerPreset } from '../../../../core/repositories/timer.repository';
import { TimerColor } from '../../../../constants/colors';
import { TimerIcon } from '../../../../constants/icons';
import { TimerSound } from '../../../../services/sound-svc';
import { SoundPicker } from "../../../../components/sound-picker/sound-picker";
import { IconPicker } from "../../../../components/icon-picker/icon-picker";
import { ColorPicker } from "../../../../components/color-picker/color-picker";
import { DurationPicker } from "../../timer-workspace/duration-picker/duration-picker";

@Component({
  selector: 'app-timer-preset-editor',
  imports: [SoundPicker, IconPicker, ColorPicker, DurationPicker],
  templateUrl: './timer-preset-editor.html',
  styleUrl: './timer-preset-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPresetEditor {
  readonly timer = input.required<TimerPreset>();
  readonly save = output<TimerPreset>();
  readonly cancel = output();

  readonly model = linkedSignal(() => structuredClone(this.timer()));

  updateTitle(e: Event) {
    const title = (e.target as HTMLInputElement).value;
    this.model.update(v => ({
      ...v,
      title
    }))
  }

  setHours(hours: number) {
    this.model.update(v => ({
      ...v,
      hours
    }))
  }

  setMinutes(minutes: number) {
    this.model.update(v => ({
      ...v,
      minutes
    }))
  }

  setSeconds(seconds: number) {
    this.model.update(v => ({
      ...v,
      seconds
    }))
  }

  setColor(color: TimerColor) {
    this.model.update(v => ({
      ...v,
      color
    }))
  }

  setIcon(icon: TimerIcon) {
    this.model.update(v => ({
      ...v,
      icon
    }))
  }

  setSound(sound: TimerSound) {
    this.model.update(v => ({
      ...v,
      sound
    }))
  }
}
