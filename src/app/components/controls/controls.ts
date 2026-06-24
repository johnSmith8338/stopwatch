import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { StopwatchEngine } from '../../services/stopwatch-engine';
import { ClockEngine } from '../../models/clock-engine.interface';

@Component({
  selector: 'app-controls',
  imports: [],
  templateUrl: './controls.html',
  styleUrl: './controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Controls {
  readonly engine = input.required<ClockEngine>();

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
