import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Toggle } from "../../../components/toggle/toggle";
import { SettingsSvc } from '../../../services/settings-svc';

@Component({
  selector: 'app-set-wakelock',
  imports: [Toggle],
  templateUrl: './set-wakelock.html',
  styleUrl: './set-wakelock.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetWakelock {
  readonly settings = inject(SettingsSvc);

  toggleWakeLock(value: boolean) {
    this.settings.setKeepScreenAwake(value);
  }
}
