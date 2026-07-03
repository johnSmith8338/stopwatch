import { inject, Injectable, signal } from '@angular/core';
import { LapSession, StopwatchRepository } from '../core/repositories/stopwatch.repository';

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
      laps: []
    }
  }

  async finishSession(totalTime: number) {
    if (!this.current) return;

    this.current.finishedAt = Date.now();
    this.current.duration = totalTime;

    await this.repo.save(this.current);
    this.touch();
    this.current = null;
  }

  async addLap(lapTime: number, totalTime: number) {
    if (!this.current) {
      return;
    };

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
}
