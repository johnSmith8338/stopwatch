import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TimerWorkspace } from "./timer-workspace/timer-workspace/timer-workspace";
import { TimerPresets } from "./presets/timer-presets/timer-presets";
import { TimerHistory } from "./timer-history/timer-history";

@Component({
  selector: 'app-timer',
  imports: [
    TimerWorkspace,
    TimerPresets,
    TimerHistory
  ],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timer { }
