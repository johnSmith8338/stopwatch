import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsSvc } from '../../../services/settings-svc';

@Component({
  selector: 'app-set-alarm-sort',
  imports: [],
  templateUrl: './set-alarm-sort.html',
  styleUrl: './set-alarm-sort.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetAlarmSort {
  readonly settings = inject(SettingsSvc);
}
