import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../services/alarm-workspace.facade';
import { AlarmListFacade } from '../../../../services/alarm-list.facade';

@Component({
  selector: 'app-alarm-group-picker',
  imports: [],
  templateUrl: './alarm-group-picker.html',
  styleUrl: './alarm-group-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmGroupPicker {
  readonly workspace = inject(AlarmWorkspaceFacade);
  readonly list = inject(AlarmListFacade);

  readonly draft = this.workspace.draft;

  readonly groups = this.list.groups;

  change(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.draft.updateGroup(value === '' ? null : value);
  }
}
