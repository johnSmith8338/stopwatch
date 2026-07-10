import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimerInstance } from '../../../../services/timer-instance';
import { SvgIcon } from "../../../../directives/svg-icon";
import { TimerFace } from "../../timer-workspace/timer-face/timer-face";
import { DigitalDisplay } from "../../timer-workspace/digital-display/digital-display";
import { TimerControls } from "../../timer-workspace/timer-controls/timer-controls";

@Component({
  selector: 'app-running-timer-card',
  imports: [SvgIcon, TimerFace, DigitalDisplay, TimerControls],
  templateUrl: './running-timer-card.html',
  styleUrl: './running-timer-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunningTimerCard {
  readonly timer = input.required<TimerInstance>();
}
