import { inject, Injectable, signal } from '@angular/core';
import { TimerHistoryRepository } from '../core/repositories/timer-history.repository';
import { TimerHistoryItem, TimerHistorySnapshot, TimerHistoryStatus } from '../models/timer-history.model';
import { TimerEngine } from './timer-engine';
import { TimerInstance } from './timer-instance';

@Injectable({
  providedIn: 'root',
})
export class TimerHistorySvc {
  private readonly repo = inject(TimerHistoryRepository);

  readonly history = signal<TimerHistoryItem[]>([]);

  constructor() {
    void this.load();
  }

  async load() {
    const history = await this.repo.load();
    this.history.set(history);
  }

  async add(timer: TimerInstance, status: TimerHistoryStatus) {
    const snapshot: TimerHistorySnapshot = {
      title: timer.title(),
      hours: timer.engine.totalHours(),
      minutes: timer.engine.totalMinutes(),
      seconds: timer.engine.totalSeconds(),
      sound: timer.sound(),
      icon: timer.icon()
    }

    const item: TimerHistoryItem = {
      id: crypto.randomUUID(),
      startedAt: timer.startedAt(),
      finishedAt: Date.now(),
      durationMs: timer.engine.totalMs(),
      elapsedMs: timer.engine.totalMs() - timer.engine.remainingMs(),
      status,
      snapshot
    }

    this.history.update(list => [item, ...list]);
    await this.repo.save(this.history());
  }

  async clear() {
    this.history.set([]);
    await this.repo.clear();
  }

  async restore(history: TimerHistoryItem[]) {
    this.history.set(structuredClone(history));
    await this.repo.save(this.history());
  }
}
