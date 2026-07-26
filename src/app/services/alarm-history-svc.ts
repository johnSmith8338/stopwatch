import { inject, Injectable, signal } from '@angular/core';
import { AlarmHistoryRepository } from '../core/repositories/alarm-history.repository';
import { AlarmHistoryItem, AlarmHistoryStatus } from '../models/alarm-history.interface';
import { Alarm } from '../models/alarm.interface';

@Injectable({
  providedIn: 'root',
})
export class AlarmHistorySvc {
  private readonly repo = inject(AlarmHistoryRepository);

  readonly history = signal<AlarmHistoryItem[]>([]);

  constructor() {
    void this.load();
  }

  async load() {
    this.history.set(await this.repo.load());
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
}
