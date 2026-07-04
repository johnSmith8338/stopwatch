import { inject, Injectable, signal } from '@angular/core';
import { TimerPreset, TimerRepository } from '../core/repositories/timer.repository';

export type PresetsFilter = 'all' | 'favorite';

@Injectable({
  providedIn: 'root',
})
export class TimerPresetsSvc {
  private readonly repo = inject(TimerRepository);

  readonly changed = signal(0);
  readonly filter = signal<PresetsFilter>('all');
  readonly search = signal('');
  readonly presets = signal<TimerPreset[]>([]);

  private touch() {
    this.changed.update(v => v + 1);
  }

  async getAll() {
    let timers = await this.repo.getAll();

    const search = this.search().trim().toLowerCase();
    if (search.length) {
      timers = timers.filter(x => x.title.toLowerCase().includes(search));
    }

    if (this.filter() === 'favorite') {
      timers = timers.filter(x => x.favorite);
    }

    timers.sort((a, b) => {
      if (a.favorite !== b.favorite) {
        return Number(b.favorite) - Number(a.favorite);
      }
      return b.updatedAt - a.updatedAt;
    })

    return timers;
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

  async toggleFavorite(timer: TimerPreset) {
    await this.save({
      ...timer,
      favorite: !timer.favorite
    })
  }
}
