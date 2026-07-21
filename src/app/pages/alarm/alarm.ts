import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmList } from "./alarm-list/alarm-list";
import { AlarmEditor } from "./alarm-editor/alarm-editor";
import { AlarmListFacade } from '../../services/alarm-list.facade';
import { ConfirmDialog } from "../../components/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-alarm-page',
  imports: [AlarmList, AlarmEditor, ConfirmDialog],
  templateUrl: './alarm.html',
  styleUrl: './alarm.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmPage {
  readonly facade = inject(AlarmListFacade);
}
