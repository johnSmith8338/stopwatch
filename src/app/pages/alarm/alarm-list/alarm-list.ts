import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AlarmListFacade } from '../../../services/alarm-list.facade';
import { AlarmsGroup } from "./alarm-group/alarm-group";
import { AlarmGroupView } from '../../../models/alarm.interface';

@Component({
  selector: 'app-alarm-list',
  imports: [AlarmsGroup],
  templateUrl: './alarm-list.html',
  styleUrl: './alarm-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmList {
  readonly facade = inject(AlarmListFacade);

  readonly groups = computed(() => this.facade.groupViews());
}
