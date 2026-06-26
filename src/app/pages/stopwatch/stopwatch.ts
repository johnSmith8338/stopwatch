import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StopwatchFace } from "../../components/stopwatch-face/stopwatch-face";
import { DigitalDisplay } from "../../components/digital-display/digital-display";
import { Controls } from "../../components/controls/controls";
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
