import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { TimerPreset } from '../../core/repositories/timer.repository';

@Component({
  selector: 'app-timer-preset-editor',
  imports: [],
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

  updateHours(e: Event) {
    const hours = Math.max(0, Number((e.target as HTMLInputElement).value));
    this.model.update(v => ({
      ...v,
      hours
    }))
  }

  updateMinutes(e: Event) {
    const minutes = Math.min(59, Math.max(0, Number((e.target as HTMLInputElement).value)));
    this.model.update(v => ({
      ...v,
      minutes
    }))
  }

  updateSeconds(e: Event) {
    const seconds = Math.min(59, Math.max(0, Number((e.target as HTMLInputElement).value)));
    this.model.update(v => ({
      ...v,
      seconds
    }))
  }
}
