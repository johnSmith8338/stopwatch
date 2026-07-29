import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AlarmListFacade } from '../../../../services/alarm-list.facade';
import { Alarm, AlarmGroupView } from '../../../../models/alarm.interface';
import { AlarmCard } from "./alarm-card/alarm-card";
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-alarms-group',
  imports: [AlarmCard, CdkDropList, CdkDrag],
  templateUrl: './alarms-group.html',
  styleUrl: './alarms-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmsGroup {
  readonly facade = inject(AlarmListFacade);

  readonly group = input.required<AlarmGroupView>();

  readonly dragDisabled = computed(() => this.facade.settings.alarmSortMode() === 'time');

  drop(event: CdkDragDrop<Alarm[]>) {
    this.facade.reorderAlarm(this.group().id, event);
  }
}
