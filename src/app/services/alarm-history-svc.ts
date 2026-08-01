import { inject, Injectable, signal } from '@angular/core';
import { AlarmHistoryRepository } from '../core/repositories/alarm-history.repository';
import { AlarmHistoryItem, AlarmHistoryStatus } from '../models/alarm-history.interface';
import { Alarm } from '../models/alarm.interface';
import { SettingsSvc } from './settings-svc';
import { cleanupHistory } from '../utils/history-cleanup';

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

  async add(sessionId: string, alarm: Alarm, status: AlarmHistoryStatus, snoozeMinutes?: number) {
    await this.cleanup();

    const item: AlarmHistoryItem = {
      id: crypto.randomUUID(),
      sessionId,
      alarmId: alarm.id,
      fireAt: Date.now(),
      status,
      snoozeMinutes,
      snapshot: {
        title: alarm.title,
        hour: alarm.hour,
        minute: alarm.minute,
        sound: alarm.sound,
        repeat: [...alarm.repeat]
      }
    }

    this.history.update(list => [item, ...list]);
    await this.repo.save(this.history());
  }

  async clear() {
    this.history.set([]);
    await this.repo.clear();
  }

  private async cleanup() {
    this.history.update(list => cleanupHistory(
      list,
      this.settings.historyRetentionDays(),
      item => item.fireAt
    ))
    await this.repo.save(this.history());
  }

  async restore(history: AlarmHistoryItem[]) {
    this.history.set(structuredClone(history));

    await this.repo.save(this.history());
  }
}
