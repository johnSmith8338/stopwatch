import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StopwatchFacade } from '../../services/stopwatch.facade';

@Component({
  selector: 'app-stopwatch-controls',
  imports: [],
  templateUrl: './stopwatch-controls.html',
  styleUrl: './stopwatch-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchControls {
  private readonly facade = inject(StopwatchFacade);

  start() {
    this.facade.start();
  }

  pause() {
    this.facade.pause();
  }

  stop() {
    void this.facade.stop();
  }

  reset() {
    this.facade.reset();
  }

  lap() {
    void this.facade.lap();
  }
}
