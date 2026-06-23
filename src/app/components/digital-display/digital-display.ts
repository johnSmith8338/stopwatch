import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StopwatchEngine } from '../../services/stopwatch-engine';

@Component({
  selector: 'app-digital-display',
  imports: [],
  templateUrl: './digital-display.html',
  styleUrl: './digital-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalDisplay {
  readonly engineSvc = inject(StopwatchEngine);

  readonly displayTime = this.engineSvc.displayTime;
}
