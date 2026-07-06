import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DigitalDisplay } from "../../components/digital-display/digital-display";
import { TimerFace } from "../../components/timer-face/timer-face";
import { TimerPresetList } from "../../components/timer-preset-list/timer-preset-list";
import { TimerPresetEditor } from "../../components/timer-preset-editor/timer-preset-editor";
import { DurationPicker } from "../../components/duration-picker/duration-picker";
import { TimerFacade } from '../../services/timer.facade';
import { TimerControls } from "../../components/timer-controls/timer-controls";

@Component({
  selector: 'app-timer',
  imports: [DigitalDisplay, TimerFace, TimerPresetList, TimerPresetEditor, DurationPicker, TimerControls],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timer {
  readonly facade = inject(TimerFacade);

  readonly engineSvc = this.facade.engine;
  readonly presetsSvc = this.facade.presetsSvc;
}
