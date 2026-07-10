import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TimerWorkspace } from "./timer-workspace/timer-workspace/timer-workspace";
import { TimerPresets } from "./presets/timer-presets/timer-presets";

@Component({
  selector: 'app-timer',
  imports: [
    TimerWorkspace,
    TimerPresets
  ],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timer { }
