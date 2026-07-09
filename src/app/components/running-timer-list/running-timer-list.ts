import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { TimerInstanceStore } from '../../services/timer-instance.store';
import { RunningTimerCard } from "../running-timer-card/running-timer-card";

@Component({
  selector: 'app-running-timer-list',
  imports: [RunningTimerCard],
  templateUrl: './running-timer-list.html',
  styleUrl: './running-timer-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunningTimerList {
  readonly store = inject(TimerInstanceStore);
}
