import { Injectable } from '@angular/core';

export interface AppState {
  timer: {
    hours: number;
    minutes: number;
    seconds: number;
  }
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
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }

    state.timer = { hours, minutes, seconds };
    this.save(state);
  }

  getTimer() {
    return this.load()?.timer;
  }
}
