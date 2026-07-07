import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimerColor } from '../../constants/colors';
import { TIMER_COLORS } from '../../constants/timer.constants';

@Component({
  selector: 'app-color-picker',
  imports: [],
  templateUrl: './color-picker.html',
  styleUrl: './color-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPicker {
  readonly value = input.required<TimerColor>();
  readonly valueChange = output<TimerColor>();

  readonly colors = TIMER_COLORS;
}
