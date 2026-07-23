import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmList } from "./alarm-list/alarm-list";
import { AlarmEditor } from "./alarm-editor/alarm-editor";
import { AlarmListFacade } from '../../services/alarm-list.facade';
import { ConfirmDialog } from "../../components/confirm-dialog/confirm-dialog";
import { AlarmRingingDialog } from "./alarm-ringing-dialog/alarm-ringing-dialog";
import { AlarmRuntime } from '../../services/alarm-runtime';
import { AlarmRingingFacade } from '../../services/alarm-ringing.facade';

@Component({
  selector: 'app-alarm-page',
  imports: [AlarmList, AlarmEditor, ConfirmDialog, AlarmRingingDialog],
  templateUrl: './alarm.html',
  styleUrl: './alarm.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmPage {
  readonly facade = inject(AlarmListFacade);
  readonly ringing = inject(AlarmRingingFacade);
  // don't delete, need runtime to get started
  private readonly runtime = inject(AlarmRuntime);
}
