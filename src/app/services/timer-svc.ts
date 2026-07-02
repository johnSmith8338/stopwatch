import { inject, Injectable } from '@angular/core';
import { TimersRepository } from '../core/repositories/timers.repository';
import { TimerEngine } from './timer-engine';

@Injectable({
  providedIn: 'root',
})
export class TimerSvc {
  private readonly repository = inject(TimersRepository);
  private readonly engine = inject(TimerEngine);

  private saveTimer?: number;

  async restore() {
    const timer = await this.repository.loadDefaults();
    if (!timer) return null;

    this.engine.setDuration(timer.hours, timer.minutes, timer.seconds);

    return timer;
  }

  async save(hours: number, minutes: number, seconds: number) {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => {
      void this.repository.saveDefaults(hours, minutes, seconds)
    }, 250)
  }
}
