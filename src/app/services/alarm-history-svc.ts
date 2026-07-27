import { inject, Injectable, signal } from '@angular/core';
import { AlarmHistoryRepository } from '../core/repositories/alarm-history.repository';
import { AlarmHistoryItem, AlarmHistoryStatus } from '../models/alarm-history.interface';
import { Alarm } from '../models/alarm.interface';
import { SettingsSvc } from './settings-svc';

@Injectable({
  providedIn: 'root',
})
export class AlarmHistorySvc {
  private readonly repo = inject(AlarmHistoryRepository);
  private readonly settings = inject(SettingsSvc);

  readonly history = signal<AlarmHistoryItem[]>([]);

  constructor() {
    void this.load();
  }

  async load() {
    this.history.set(await this.repo.load());
    await this.cleanup();
  }

  async add(alarm: Alarm, status: AlarmHistoryStatus, snoozeMinutes?: number) {
    const item: AlarmHistoryItem = {
      id: crypto.randomUUID(),
      alarmId: alarm.id,
      title: alarm.title,
      fireAt: Date.now(),
      status,
      snoozeMinutes
    }

    this.history.update(list => [item, ...list]);
    await this.repo.save(this.history());
  }

  async clear() {
    this.history.set([]);
    await this.repo.clear();
  }

  private async cleanup() {
    const days = this.settings.historyRetentionDays();
    if (days === -1) return;

    const limit = Date.now() - days * 86_400_000;
    this.history.update(list => list.filter(item => item.fireAt >= limit));
    await this.repo.save(this.history());
  }

  async restore(history: AlarmHistoryItem[]) {
    this.history.set(structuredClone(history));

    await this.repo.save(this.history());
  }
}
