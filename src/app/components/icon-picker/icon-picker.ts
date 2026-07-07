import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimerIcon } from '../../constants/icons';
import { TIMER_ICONS } from '../../constants/timer.constants';
import { SvgIcon } from "../../directives/svg-icon";

@Component({
  selector: 'app-icon-picker',
  imports: [SvgIcon],
  templateUrl: './icon-picker.html',
  styleUrl: './icon-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPicker {
  readonly value = input.required<TimerIcon>();
  readonly valueChange = output<TimerIcon>();

  readonly icons = TIMER_ICONS;
}
