import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimerPreset } from '../../core/repositories/timer.repository';
import { TimerPresetCard } from "../timer-preset-card/timer-preset-card";

@Component({
  selector: 'app-timer-preset-list',
  imports: [TimerPresetCard],
  templateUrl: './timer-preset-list.html',
  styleUrl: './timer-preset-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPresetList {
  readonly timers = input.required<TimerPreset[]>();

  readonly edit = output<TimerPreset>();
  readonly start = output<TimerPreset>();
  readonly remove = output<string>();
}
