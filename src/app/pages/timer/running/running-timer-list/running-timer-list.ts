import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TimerInstanceStore } from '../../../../services/timer-instance.store';
import { RunningTimerCard } from "../running-timer-card/running-timer-card";
import { TimerFinishedDialog } from "../../../../components/timer-finished-dialog/timer-finished-dialog";
import { TimerInstance } from '../../../../services/timer-instance';

@Component({
  selector: 'app-running-timer-list',
  imports: [RunningTimerCard, TimerFinishedDialog],
  templateUrl: './running-timer-list.html',
  styleUrl: './running-timer-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunningTimerList {
  readonly store = inject(TimerInstanceStore);

  repeat(timer: TimerInstance) {
    this.store.repeat(timer);
  }

  stop(timer: TimerInstance) {
    this.store.stop(timer);
  }
}
