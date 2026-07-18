import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StopwatchFace } from "../../components/stopwatch-face/stopwatch-face";
import { StopwatchEngine } from '../../services/stopwatch-engine';
import { StopwatchHistorySvc } from '../../services/stopwatch-history-svc';
import { StopwatchControls } from "../../components/stopwatch-controls/stopwatch-controls";
import { StopwatchHistory } from "../../components/stopwatch-history/stopwatch-history";

@Component({
  selector: 'app-stopwatch',
  imports: [
    StopwatchFace,
    StopwatchControls,
    StopwatchHistory
  ],
  templateUrl: './stopwatch.html',
  styleUrl: './stopwatch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stopwatch {
  readonly engine = inject(StopwatchEngine);
  readonly history = inject(StopwatchHistorySvc);
}
