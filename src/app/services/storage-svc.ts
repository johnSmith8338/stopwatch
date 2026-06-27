import { Injectable } from '@angular/core';
import { ThemeTYpe } from './theme-svc';
import { TIMER_DEFAULT_HOUR, TIMER_DEFAULT_MINUTE, TIMER_DEFAULT_SECOND } from '../constants/timer.constants';

export interface AppState {
  timer: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  theme: ThemeTYpe;
}

@Injectable({
  providedIn: 'root',
})
export class StorageSvc {
  private readonly STORAGE_KEY = 'clock-settings-v1';

  load(): AppState | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private save(state: AppState) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  saveTimer(hours: number, minutes: number, seconds: number) {
    const state = this.load() ?? {
      timer: {
        hours: TIMER_DEFAULT_HOUR,
        minutes: TIMER_DEFAULT_MINUTE,
        seconds: TIMER_DEFAULT_SECOND
      },
      theme: 'light'
    }

    state.timer = { hours, minutes, seconds };
    this.save(state);
  }

  getTimer() {
    return this.load()?.timer;
  }

  getTheme(): ThemeTYpe {
    return this.load()?.theme ?? 'light';
  }

  saveTheme(theme: ThemeTYpe) {
    const state = this.load() ?? {
      timer: {
        hours: TIMER_DEFAULT_HOUR,
        minutes: TIMER_DEFAULT_MINUTE,
        seconds: TIMER_DEFAULT_SECOND,
      },
      theme: 'light'
    }
    state.theme = theme;
    this.save(state);
  }
}
