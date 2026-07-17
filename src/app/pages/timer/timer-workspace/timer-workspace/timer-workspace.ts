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

  readonly editorOpened = signal(true);

  readonly hasRunningTimers = computed(() => this.facade.instance.timers().length > 0);

  constructor() {
    effect(() => {
      if (this.facade.instance.timers().length === 0) this.editorOpened.set(true);
    })
  }

  start() {
    this.facade.start();
    this.editorOpened.set(false);
  }

  showEditor() {
    this.editorOpened.set(true);
  }
}
