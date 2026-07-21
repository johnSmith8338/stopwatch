import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../services/alarm-workspace.facade';
import { AlarmFace } from "./alarm-face/alarm-face";
import { AlarmDialStep } from '../../../../models/alarm-dial-step.interface';
import { AlarmInputs } from "./alarm-inputs/alarm-inputs";
import { AlarmWheelPicker } from "./alarm-wheel-picker/alarm-wheel-picker";
import { AlarmTimeUnit } from '../../../../models/alarm-time-unit.type';
import { AlarmInputMode } from '../../../../models/alarm-input-mode.type';

@Component({
  selector: 'app-alarm-time-picker',
  imports: [AlarmFace, AlarmInputs, AlarmWheelPicker],
  templateUrl: './alarm-time-picker.html',
  styleUrl: './alarm-time-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmTimePicker {
  readonly workspace = inject(AlarmWorkspaceFacade);

  readonly draft = this.workspace.draft;

  readonly inputMode = signal<AlarmInputMode>('dial');
  readonly faceMode = signal<AlarmTimeUnit>('hour');

  dialChanged(step: AlarmDialStep) {
    if (step.unit === 'hour') {
      this.draft.updateHour(step.value);
      return;
    }

    this.draft.updateMinute(step.value);
  }

  dialFinished() {
    if (this.faceMode() === 'hour') this.faceMode.set('minute');
  }
}
