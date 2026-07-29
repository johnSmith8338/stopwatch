import { computed, inject, Injectable, signal } from '@angular/core';
import { SettingsRepository } from '../core/repositories/settings.repositiry';
import { AppSettings, AppTheme, HistoryRetentionDays } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsSvc {
  private readonly repo = inject(SettingsRepository);

  readonly settings = signal<AppSettings>({
    theme: 'light',
    historyRetentionDays: 30,
    keepScreenAwake: true
  })

  readonly theme = computed(() => this.settings().theme);
  readonly historyRetentionDays = computed(() => this.settings().historyRetentionDays);
  readonly keepScreenAwake = computed(() => this.settings().keepScreenAwake);

  constructor() {
    void this.load();
  }

  async load() {
    this.settings.set(await this.repo.load());
  }

  async setTheme(theme: AppTheme) {
    const settings: AppSettings = {
      ...this.settings(),
      theme
    }

    this.settings.set(settings);
    await this.repo.save(settings);
  }

  async toggleTheme() {
    await this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  async setHistoryRetentionDays(days: HistoryRetentionDays) {
    const settings: AppSettings = {
      ...this.settings(),
      historyRetentionDays: days
    }

    this.settings.set(settings);
    await this.repo.save(settings);
  }

  async setKeepScreenAwake(value: boolean) {
    this.settings.update(s => ({
      ...s,
      keepScreenAwake: value
    }))
    await this.repo.save(this.settings());
  }

  async restore(settings: AppSettings) {
    this.settings.set(structuredClone(settings));
    await this.repo.save(this.settings());
  }
}
