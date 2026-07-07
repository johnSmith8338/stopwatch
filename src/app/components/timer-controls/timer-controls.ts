import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TimerFacade } from '../../services/timer.facade';

@Component({
  selector: 'app-timer-controls',
  imports: [],
  templateUrl: './timer-controls.html',
  styleUrl: './timer-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerControls {
  readonly facade = inject(TimerFacade);

  readonly disabled = computed(() => this.facade.dialogOpened());

  start() {
    this.facade.start();
  }

  pause() {
    this.facade.pause();
  }

  stop() {
    this.facade.stop();
  }

  reset() {
    this.facade.reset();
  }

  resetDefault() {
    this.facade.resetDefault();
  }
}
