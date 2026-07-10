import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
  readonly engine = input.required<TimerControlsEngine>();
  readonly disabled = input(false);

  start() {
    this.engine().start();
  }

  pause() {
    this.engine().pause();
  }

  stop() {
    this.engine().stop();
  }

  reset() {
    this.engine().reset();
  }
}
