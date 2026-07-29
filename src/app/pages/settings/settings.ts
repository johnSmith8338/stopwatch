import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DefaultTimerSettings } from '../timer/timer-workspace/timer-settings/timer-settings';
import { Toggle } from "../../components/toggle/toggle";
import { ThemeSvc } from '../../services/theme-svc';
import { SettingsSvc } from '../../services/settings-svc';
import { HistoryRetentionDays } from '../../models/settings.model';
import { BackupSvc } from '../../services/backup-svc';

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
  readonly backup = inject(BackupSvc);

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

  toggleWakeLock(value: boolean) {
    this.settings.setKeepScreenAwake(value);
  }

  exportBackup() {
    this.backup.export();
  }

  async importBackup(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      await this.backup.import(file);
      alert('backup imported');
    } catch {
      alert('invalid backup file');
    } finally {
      input.value = '';
    }
  }
}
