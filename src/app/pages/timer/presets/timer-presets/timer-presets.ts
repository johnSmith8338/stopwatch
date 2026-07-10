import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PresetToolbar } from "../preset-toolbar/preset-toolbar";
import { TimerPresetsFacade } from '../timer-presets.facade';
import { TimerPresetEditor } from "../timer-preset-editor/timer-preset-editor";
import { ConfirmDialog } from "../../../../components/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-timer-presets',
  imports: [PresetToolbar, TimerPresetEditor, ConfirmDialog],
  templateUrl: './timer-presets.html',
  styleUrl: './timer-presets.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPresets {
  readonly facade = inject(TimerPresetsFacade);
}
