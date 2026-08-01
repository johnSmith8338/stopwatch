import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsSvc } from '../../../services/settings-svc';

@Component({
  selector: 'app-set-alarm-duration',
  imports: [],
  templateUrl: './set-alarm-duration.html',
  styleUrl: './set-alarm-duration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetAlarmDuration {
  readonly settings = inject(SettingsSvc);
}
