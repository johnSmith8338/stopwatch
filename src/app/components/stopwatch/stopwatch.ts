import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StopwatchFace } from "../stopwatch-face/stopwatch-face";
import { DigitalDisplay } from "../digital-display/digital-display";
import { Controls } from "../controls/controls";

@Component({
  selector: 'app-stopwatch',
  imports: [StopwatchFace, DigitalDisplay, Controls],
  templateUrl: './stopwatch.html',
  styleUrl: './stopwatch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stopwatch { }
