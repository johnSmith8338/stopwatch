import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StopwatchEngine } from '../../services/stopwatch-engine';

@Component({
  selector: 'app-controls',
  imports: [],
  templateUrl: './controls.html',
  styleUrl: './controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Controls {
  readonly engineSvc = inject(StopwatchEngine);

  start() {
    this.engineSvc.start();
  }
  pause() {
    this.engineSvc.pause();
  }
  stop() {
    this.engineSvc.stop();
  }
  reset() {
    this.engineSvc.reset();
  }
}
