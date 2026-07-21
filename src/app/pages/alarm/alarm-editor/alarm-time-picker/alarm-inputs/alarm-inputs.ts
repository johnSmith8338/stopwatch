import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../../services/alarm-workspace.facade';

@Component({
  selector: 'app-alarm-inputs',
  imports: [],
  templateUrl: './alarm-inputs.html',
  styleUrl: './alarm-inputs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmInputs {
  readonly workspace = inject(AlarmWorkspaceFacade);

  readonly draft = this.workspace.draft;

  updateHour(event: Event) {
    this.draft.updateHour(
      Number((event.target as HTMLInputElement).value)
    )
  }

  updateMinute(event: Event) {
    this.draft.updateMinute(
      Number((event.target as HTMLInputElement).value)
    )
  }
}
