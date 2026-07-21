import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../services/alarm-workspace.facade';

@Component({
  selector: 'app-alarm-snooze-picker',
  imports: [],
  templateUrl: './alarm-snooze-picker.html',
  styleUrl: './alarm-snooze-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmSnoozePicker {
  readonly workspace = inject(AlarmWorkspaceFacade);

  readonly draft = this.workspace.draft;

  readonly values = [0, 1, 3, 5, 10, 15, 20, 30];

  change(event: Event) {
    this.draft.updateSnooze(Number((event.target as HTMLSelectElement).value));
  }
}
