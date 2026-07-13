import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DraftTimer } from '../../../../services/draft-timer';

export interface TimerControlsEngine {
  running(): boolean;
  start(): void;
  pause(): void;
  stop(): void;
  reset(): void;
}

@Component({
  selector: 'app-timer-controls',
  imports: [],
  templateUrl: './timer-controls.html',
  styleUrl: './timer-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerControls {
  readonly timer = input.required<DraftTimer>();
  readonly disabled = input(false);

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
