import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AlarmRepeat } from '../../../../../models/alarm.interface';
import { buildRepeatDays } from '../../../../../utils/repeat-days';

@Component({
  selector: 'app-alarm-repeat-preview',
  imports: [],
  templateUrl: './alarm-repeat-preview.html',
  styleUrl: './alarm-repeat-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmRepeatPreview {
  readonly repeat = input.required<AlarmRepeat[]>();

  readonly days = buildRepeatDays();

  readonly allSelected = computed(() => this.repeat.length === 7)
}
