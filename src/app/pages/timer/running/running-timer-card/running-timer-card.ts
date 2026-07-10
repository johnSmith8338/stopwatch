import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimerInstance } from '../../../../services/timer-instance';
import { SvgIcon } from "../../../../directives/svg-icon";

@Component({
  selector: 'app-running-timer-card',
  imports: [SvgIcon],
  templateUrl: './running-timer-card.html',
  styleUrl: './running-timer-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunningTimerCard {
  readonly timer = input.required<TimerInstance>();

  start() {
    this.timer().start();
  }

  pause() {
    this.timer().pause();
  }

  stop() {
    this.timer().stop();
  }

  reset() {
    this.timer().reset();
  }
}
