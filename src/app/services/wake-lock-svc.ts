import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WakeLockSvc {
  private lock: WakeLockSentinel | null = null;
  readonly active = signal(false);

  async acquire() {
    if (!('wakelock' in navigator)) return;
    if (this.lock) return;

    try {
      this.lock = await navigator.wakeLock.request('screen');
      this.active.set(true);
      this.lock.addEventListener('release', () => {
        this.lock = null;
        this.active.set(false);
      })
    } catch { }
  }

  async release() {
    if (!this.lock) return;

    await this.lock.release();
    this.lock = null;
    this.active.set(false);
  }
}
