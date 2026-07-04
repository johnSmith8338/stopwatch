import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { TimerPreset } from '../../core/repositories/timer.repository';
import { WheelPicker } from "../wheel-picker/wheel-picker";
import { DurationPicker } from "../duration-picker/duration-picker";

@Component({
  selector: 'app-timer-preset-editor',
  imports: [DurationPicker],
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
}
