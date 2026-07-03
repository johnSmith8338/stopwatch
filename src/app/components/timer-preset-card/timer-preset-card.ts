import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimerPreset } from '../../core/repositories/timer.repository';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-timer-preset-card',
  imports: [DecimalPipe],
  templateUrl: './timer-preset-card.html',
  styleUrl: './timer-preset-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPresetCard {
  readonly timer = input.required<TimerPreset>();

  readonly start = output<TimerPreset>();
  readonly edit = output<TimerPreset>();
  readonly remove = output<string>();
}
