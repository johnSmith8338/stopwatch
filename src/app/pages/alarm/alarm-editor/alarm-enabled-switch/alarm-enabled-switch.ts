import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../services/alarm-workspace.facade';
import { Toggle } from "../../../../components/toggle/toggle";

@Component({
  selector: 'app-alarm-enabled-switch',
  imports: [Toggle],
  templateUrl: './alarm-enabled-switch.html',
  styleUrl: './alarm-enabled-switch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmEnabledSwitch {
  readonly workspace = inject(AlarmWorkspaceFacade);

  readonly draft = this.workspace.draft;

  change(enabled: boolean) {
    if (enabled !== this.draft.enabled()) this.draft.toggleEnabled();
  }
}
