import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AlarmListFacade } from '../../../../services/alarm-list.facade';
import { Alarm, AlarmGroupView } from '../../../../models/alarm.interface';
import { AlarmCard } from "./alarm-card/alarm-card";

@Component({
  selector: 'app-alarms-group',
  imports: [AlarmCard],
  templateUrl: './alarms-group.html',
  styleUrl: './alarms-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmsGroup {
  readonly facade = inject(AlarmListFacade);

  readonly group = input.required<AlarmGroupView>();
}
