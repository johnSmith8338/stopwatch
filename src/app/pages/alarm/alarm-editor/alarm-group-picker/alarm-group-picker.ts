import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../services/alarm-workspace.facade';
import { AlarmListFacade } from '../../../../services/alarm-list.facade';
import { SheetSelect } from "../../../../components/sheet-select/sheet-select";

@Component({
  selector: 'app-alarm-group-picker',
  imports: [SheetSelect],
  templateUrl: './alarm-group-picker.html',
  styleUrl: './alarm-group-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmGroupPicker {
  readonly workspace = inject(AlarmWorkspaceFacade);
  readonly list = inject(AlarmListFacade);

  readonly draft = this.workspace.draft;

  readonly groups = this.list.groups;

  readonly opened = signal(false);

  readonly items = computed(() => [
    {
      id: null,
      title: 'ungrouped'
    },
    ...this.list.groups().map(group => ({
      id: group.id,
      title: group.title
    }))
  ])

  change(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.draft.updateGroup(value === '' ? null : value);
  }
}
