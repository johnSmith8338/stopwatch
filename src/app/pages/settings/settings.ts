import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DefaultTimerSettings } from '../timer/timer-workspace/timer-settings/timer-settings';
import { Toggle } from "../../components/toggle/toggle";
import { ThemeSvc } from '../../services/theme-svc';
import { SettingsSvc } from '../../services/settings-svc';
import { HistoryRetentionDays } from '../../models/settings.model';

@Component({
  selector: 'app-settings',
  imports: [DefaultTimerSettings, Toggle],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  readonly settings = inject(SettingsSvc);
  readonly themeSvc = inject(ThemeSvc);

  checked = this.themeSvc.theme() === 'dark';

  changeTheme() {
    this.themeSvc.toggle();
  }

  changeHistory(event: Event) {
    this.settings.setHistoryRetentionDays(
      Number(
        (event.target as HTMLSelectElement).value
      ) as HistoryRetentionDays
    );
  }
}
