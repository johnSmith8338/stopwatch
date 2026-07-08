import { computed, inject, Injectable, signal } from '@angular/core';
import { TimerAppSettings, TimersRepository } from '../core/repositories/timers.repository';
import { TimerEngine } from './timer-engine';

@Injectable({
  providedIn: 'root',
})
export class TimerSettingsSvc {
  private readonly repo = inject(TimersRepository);
  private readonly engine = inject(TimerEngine);

  private saveTimer?: number;

  readonly settings = signal<TimerAppSettings | null>(null);

  readonly loaded = computed(() => this.settings() !== null);

  async load() {
    let settings = await this.repo.loadSettings();

    if (!settings) {
      settings = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        color: 'transparent',
        icon: '',
        sound: 'ding'
      }

      await this.repo.saveSettings(settings);
    };

    this.settings.set(settings);
    this.engine.setDuration(
      settings.hours,
      settings.minutes,
      settings.seconds
    )
  }

  private save(settings: TimerAppSettings) {
    clearTimeout(this.saveTimer);

    this.saveTimer = window.setTimeout(() => {
      void this.repo.saveSettings(settings);
    }, 250)
  }

  patch(patch: Partial<TimerAppSettings>) {
    const current = this.settings();
    if (!current) return;

    const next = {
      ...current,
      ...patch
    }

    this.settings.set(next);

    this.engine.setDuration(
      next.hours,
      next.minutes,
      next.seconds
    )

    this.save(next);
  }
}
