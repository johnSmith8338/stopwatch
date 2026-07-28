import { inject, Injectable } from '@angular/core';
import { AlarmSvc } from './alarm-svc';
import { AlarmHistorySvc } from './alarm-history-svc';
import { SettingsSvc } from './settings-svc';
import { AppBackup } from '../models/backup.model';

@Injectable({
  providedIn: 'root',
})
export class BackupSvc {
  private readonly alarmSvc = inject(AlarmSvc);
  private readonly historySvc = inject(AlarmHistorySvc);
  private readonly settingsSvs = inject(SettingsSvc);

  async export() {
    const backup: AppBackup = {
      version: 1,
      app: 'alarm-clock',
      exportedAt: Date.now(),
      alarms: structuredClone(this.alarmSvc.alarms()),
      groups: structuredClone(this.alarmSvc.groups()),
      history: structuredClone(this.historySvc.history()),
      settings: structuredClone(this.settingsSvs.settings())
    }

    const blob = new Blob(
      [
        JSON.stringify(backup, null, 2)
      ],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alarm-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async import(file: File) {
    const text = await file.text();
    const backup = JSON.parse(text) as AppBackup;

    if (backup.app !== 'alarm-clock') {
      throw new Error('invalid backup');
    }

    if (
      typeof backup !== 'object' ||
      backup === null ||
      backup.version !== 1 ||
      !Array.isArray(backup.alarms) ||
      !Array.isArray(backup.groups) ||
      !Array.isArray(backup.history) ||
      typeof backup.settings !== 'object' ||
      backup.settings === null
    ) {
      throw new Error('invalid backup');
    }

    const settings = backup.settings;
    const validRetention =
      settings.historyRetentionDays === -1 ||
      settings.historyRetentionDays === 1 ||
      settings.historyRetentionDays === 7 ||
      settings.historyRetentionDays === 30 ||
      settings.historyRetentionDays === 90;

    const validTheme =
      settings.theme === 'light' ||
      settings.theme === 'dark';

    if (!validRetention || !validTheme) {
      throw new Error('invalid settings');
    }

    await this.alarmSvc.restore(
      backup.groups,
      backup.alarms
    )

    await this.historySvc.restore(
      backup.history
    )

    await this.settingsSvs.restore(
      backup.settings
    )
  }
}
