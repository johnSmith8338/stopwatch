import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimerFaceEngine, TimerFace } from '../timer-workspace/timer-face/timer-face';
import { DigitalDisplayEngine, DigitalDisplay } from '../timer-workspace/digital-display/digital-display';
import { TimerControlsEngine, TimerControls } from '../timer-workspace/timer-controls/timer-controls';

@Component({
  selector: 'app-timer-panel',
  imports: [TimerFace, DigitalDisplay, TimerControls],
  templateUrl: './timer-panel.html',
  styleUrl: './timer-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPanel {
  readonly face = input.required<TimerFaceEngine>();
  readonly display = input.required<DigitalDisplayEngine>();
  readonly controls = input.required<TimerControlsEngine>();
  readonly disabled = input(false);
}
