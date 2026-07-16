import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimerWorkspaceFacade } from '../timer-workspace.facade';
import { SvgIcon } from '../../../../directives/svg-icon';
import { TimerSettings } from "../timer-settings/timer-settings";
import { RunningTimerList } from "../../running/running-timer-list/running-timer-list";
import { DurationPicker } from "../duration-picker/duration-picker";

@Component({
  selector: 'app-timer-workspace',
  imports: [
    SvgIcon,
    TimerSettings,
    RunningTimerList,
    DurationPicker,
  ],
  templateUrl: './timer-workspace.html',
  styleUrl: './timer-workspace.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerWorkspace {
  readonly facade = inject(TimerWorkspaceFacade);
}
