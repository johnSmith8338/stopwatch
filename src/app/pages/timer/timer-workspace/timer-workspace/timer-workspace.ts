import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { TimerWorkspaceFacade } from '../timer-workspace.facade';
import { SvgIcon } from '../../../../directives/svg-icon';
import { RunningTimerList } from "../../running/running-timer-list/running-timer-list";
import { DurationPicker } from "../duration-picker/duration-picker";

@Component({
  selector: 'app-timer-workspace',
  imports: [
    SvgIcon,
    RunningTimerList,
    DurationPicker,
  ],
  templateUrl: './timer-workspace.html',
  styleUrl: './timer-workspace.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerWorkspace {
  readonly facade = inject(TimerWorkspaceFacade);

  readonly hasRunningTimers = computed(() => this.facade.instance.timers().length > 0);

  readonly showEditor = computed(() => {
    return this.facade.instance.timers().length === 0 || this.facade.editorOpened();
  });

  start() {
    this.facade.start();
  }

  resetToDefault() {
    this.facade.resetDefault();
  }

  addTimer() {
    this.facade.showEditor();
  }
}
