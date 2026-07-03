import { inject, Injectable, signal } from '@angular/core';
import { TimerPreset, TimerRepository } from '../core/repositories/timer.repository';

@Injectable({
  providedIn: 'root',
})
export class TimerPresetsSvc {
  private readonly repo = inject(TimerRepository);

  readonly changed = signal(0);

  private touch() {
    this.changed.update(v => v + 1);
  }

  async getAll() {
    return this.repo.getAll();
  }

  async save(timer: TimerPreset) {
    timer.updatedAt = Date.now();
    await this.repo.save(timer);
    this.touch();
  }

  async delete(id: string) {
    await this.repo.delete(id);
    this.touch();
  }

  create(): TimerPreset {
    const now = Date.now();

    return {
      id: crypto.randomUUID(),
      title: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
      favorite: false,
      createdAt: now,
      updatedAt: now
    }
  }
}
