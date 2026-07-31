import { inject, Injectable, signal } from '@angular/core';
import { EMPTY_STOPWATCH_STATS, LapSession, StopwatchRepository } from '../core/repositories/stopwatch.repository';
import { calculateSessionStats } from '../utils/stopwatch-session-stats';

@Injectable({
  providedIn: 'root',
})
export class StopwatchHistorySvc {
  private readonly repo = inject(StopwatchRepository);

  private current: LapSession | null = null;

  readonly changed = signal(0);

  private touch() {
    this.changed.update(v => v + 1);
  }

  startSession() {
    if (this.current) return;

    this.current = {
      id: crypto.randomUUID(),
      startedAt: Date.now(),
      finishedAt: 0,
      duration: 0,
      laps: [],
      stats: EMPTY_STOPWATCH_STATS
    }
  }

  async finishSession(totalTime: number) {
    if (!this.current) return;

    this.current.finishedAt = Date.now();
    this.current.duration = totalTime;
    this.current.stats = calculateSessionStats(this.current.laps);

    await this.repo.save(this.current);
    this.touch();
    this.current = null;
  }

  async addLap(lapTime: number, totalTime: number) {
    if (!this.current) return;

    this.current.duration = totalTime;

    this.current.laps.push({
      id: crypto.randomUUID(),
      index: this.current.laps.length + 1,
      lapTime,
      totalTime,
      createdAt: Date.now()
    })

    await this.repo.save(this.current);
    this.touch();
  }

  getHistory() {
    return this.repo.getAll();
  }

  async deleteSession(id: string) {
    await this.repo.delete(id);
    this.touch();
  }

  async clear() {
    await this.repo.clear();
    this.touch();
  }

  async restore(history: LapSession[]) {
    await this.repo.restore(history);
    this.touch();
  }
}
