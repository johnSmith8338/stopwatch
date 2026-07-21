import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmWorkspaceFacade } from '../../../../services/alarm-workspace.facade';

@Component({
  selector: 'app-alarm-title-editor',
  imports: [],
  templateUrl: './alarm-title-editor.html',
  styleUrl: './alarm-title-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmTitleEditor {
  readonly workspace = inject(AlarmWorkspaceFacade);

  readonly draft = this.workspace.draft;

  updateTitle(event: Event) {
    this.draft.updateTitle((event.target as HTMLInputElement).value);
  }
}
