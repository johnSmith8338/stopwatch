import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AlarmListFacade } from '../../../../../services/alarm-list.facade';
import { Alarm } from '../../../../../models/alarm.interface';

@Component({
  selector: 'app-alarm-card',
  imports: [],
  templateUrl: './alarm-card.html',
  styleUrl: './alarm-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmCard {
  readonly facade = inject(AlarmListFacade);

  readonly alarm = input.required<Alarm>();

  readonly repeatText = computed(() => {
    const repeat = this.alarm().repeat;
    if (!repeat.length) return 'once';
    return repeat.join(' ,');
  })
}
