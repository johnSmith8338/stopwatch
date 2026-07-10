import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimerWorkspaceFacade } from '../timer-workspace.facade';
import { SvgIcon } from '../../../../directives/svg-icon';
import { TimerFace } from "../timer-face/timer-face";
import { DigitalDisplay } from "../digital-display/digital-display";
import { TimerControls } from "../timer-controls/timer-controls";
import { TimerSettings } from "../timer-settings/timer-settings";
import { TimerFinishedDialog } from "../../../../components/timer-finished-dialog/timer-finished-dialog";
import { RunningTimerList } from "../../running/running-timer-list/running-timer-list";
import { DurationPicker } from "../duration-picker/duration-picker";

@Component({
  selector: 'app-timer-workspace',
  imports: [
    SvgIcon,
    TimerFace,
    DigitalDisplay,
    TimerControls,
    TimerSettings,
    TimerFinishedDialog,
    RunningTimerList,
    DurationPicker
  ],
  templateUrl: './timer-workspace.html',
  styleUrl: './timer-workspace.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerWorkspace {
  readonly facade = inject(TimerWorkspaceFacade);
}
