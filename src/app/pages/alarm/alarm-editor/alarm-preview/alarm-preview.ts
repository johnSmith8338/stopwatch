import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../services/alarm-workspace.facade';
import { AlarmRepeatPreview } from "./alarm-repeat-preview/alarm-repeat-preview";

@Component({
  selector: 'app-alarm-preview',
  imports: [AlarmRepeatPreview],
  templateUrl: './alarm-preview.html',
  styleUrl: './alarm-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmPreview {
  readonly workspace = inject(AlarmWorkspaceFacade);

  readonly draft = this.workspace.draft;

  readonly time = computed(() => {
    const hour = this.draft.hour().toString().padStart(2, '0');
    const minute = this.draft.minute().toString().padStart(2, '0');

    return `${hour}:${minute}`;
  })
}
