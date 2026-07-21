import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AlarmRepeat } from '../../../../models/alarm.interface';
import { buildRepeatDays } from '../../../../utils/repeat-days';

@Component({
  selector: 'app-alarm-repeat-editor',
  imports: [],
  templateUrl: './alarm-repeat-editor.html',
  styleUrl: './alarm-repeat-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmRepeatEditor {
  readonly repeat = input.required<AlarmRepeat[]>();
  readonly repeatChange = output<AlarmRepeat[]>();

  readonly days = buildRepeatDays();

  isActive(day: AlarmRepeat) {
    return this.repeat().includes(day);
  }

  toggle(day: AlarmRepeat) {
    const repeat = [...this.repeat()];
    const index = repeat.indexOf(day);

    if (index >= 0) {
      repeat.splice(index, 1);
    } else {
      repeat.push(day);
    }

    this.repeatChange.emit(repeat);
  }
}
