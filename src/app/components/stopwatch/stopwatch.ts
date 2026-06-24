import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StopwatchFace } from "../stopwatch-face/stopwatch-face";
import { DigitalDisplay } from "../digital-display/digital-display";
import { Controls } from "../controls/controls";
import { StopwatchEngine } from '../../services/stopwatch-engine';

@Component({
  selector: 'app-stopwatch',
  imports: [StopwatchFace, DigitalDisplay, Controls],
  templateUrl: './stopwatch.html',
  styleUrl: './stopwatch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stopwatch {
  engineSvc = inject(StopwatchEngine);
}
