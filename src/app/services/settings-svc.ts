import { computed, inject, Injectable, signal } from '@angular/core';
import { SettingsRepository } from '../core/repositories/settings.repositiry';
import { AppSettings, HistoryRetentionDays } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsSvc {
  private readonly repo = inject(SettingsRepository);

  readonly settings = signal<AppSettings>({
    historyRetentionDays: 30
  })

  readonly historyRetentionDays = computed(() => this.settings().historyRetentionDays);

  constructor() {
    void this.load();
  }

  async load() {
    this.settings.set(await this.repo.load());
  }

  async setHistoryRetentionDays(days: HistoryRetentionDays) {
    const settings: AppSettings = {
      ...this.settings(),
      historyRetentionDays: days
    }

    this.settings.set(settings);
    await this.repo.save(settings);
  }
}
