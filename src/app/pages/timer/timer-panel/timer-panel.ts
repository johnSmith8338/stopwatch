import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimerFace } from '../timer-workspace/timer-face/timer-face';
import { DigitalDisplay } from '../timer-workspace/digital-display/digital-display';
import { TimerControls } from '../timer-workspace/timer-controls/timer-controls';
import { DraftTimer } from '../../../services/draft-timer';

@Component({
  selector: 'app-timer-panel',
  imports: [TimerFace, DigitalDisplay, TimerControls],
  templateUrl: './timer-panel.html',
  styleUrl: './timer-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPanel {
  readonly timer = input.required<DraftTimer>();
  readonly disabled = input(false);
}
