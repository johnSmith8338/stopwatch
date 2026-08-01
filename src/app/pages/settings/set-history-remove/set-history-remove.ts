import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsSvc } from '../../../services/settings-svc';

@Component({
  selector: 'app-set-history-remove',
  imports: [],
  templateUrl: './set-history-remove.html',
  styleUrl: './set-history-remove.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetHistoryRemove {
  readonly settings = inject(SettingsSvc);
}
