import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../../services/alarm-workspace.facade';
import { WheelPicker } from "../../../../../components/wheel-picker/wheel-picker";

@Component({
  selector: 'app-alarm-wheel-picker',
  imports: [WheelPicker],
  templateUrl: './alarm-wheel-picker.html',
  styleUrl: './alarm-wheel-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmWheelPicker {
  readonly workspace = inject(AlarmWorkspaceFacade);

  readonly draft = this.workspace.draft;

  readonly hourItems = Array.from({ length: 24 }, (_, i) => i);
  readonly minuteItems = Array.from({ length: 60 }, (_, i) => i);
}
