import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimerInstance } from '../../../../services/timer-instance';
import { SvgIcon } from "../../../../directives/svg-icon";
import { TimerPanel } from "../../timer-panel/timer-panel";

@Component({
  selector: 'app-running-timer-card',
  imports: [
    SvgIcon,
    TimerPanel,
  ],
  templateUrl: './running-timer-card.html',
  styleUrl: './running-timer-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunningTimerCard {
  readonly timer = input.required<TimerInstance>();
}
