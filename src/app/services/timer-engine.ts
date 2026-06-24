import { computed, Injectable, Signal, signal } from '@angular/core';
import { ClockEngine } from '../models/clock-engine.interface';

@Injectable({
  providedIn: 'root',
})
export class TimerEngine implements ClockEngine {
  readonly defaultHours = 0;
  readonly defaultMinutes = 5;
  readonly defaultSeconds = 0;

  readonly running = signal(false);
  readonly totalMs = signal(5 * 60_000);
  readonly remainingMs = signal(5 * 60_000);

  private frameId = 0;
  private startTimestamp = 0;
  private remainingAtStart = 0;
  private stopped = false;

  readonly displayTime = computed(() => this.formatTime(this.remainingMs()));

  getDefaults() {
    return {
      hours: this.defaultHours,
      minutes: this.defaultMinutes,
      seconds: this.defaultSeconds
    }
  }

  start(): void {
    if (this.running()) return;
    if (this.remainingMs() <= 0) return;
    if (this.stopped) {
      this.remainingMs.set(this.totalMs())
    }

    this.running.set(true);
    this.stopped = false;
    this.remainingAtStart = this.remainingMs();
    this.startTimestamp = performance.now();

    const tick = () => {
      if (!this.running()) return;

      const elapsed = performance.now() - this.startTimestamp;
      const remaining = Math.max(this.remainingAtStart - elapsed, 0);
      this.remainingMs.set(remaining);

      if (remaining === 0) {
        this.stop();
        return;
      }

      this.frameId = requestAnimationFrame(tick);
    }

    tick();
  }

  pause(): void {
    if (!this.running()) return;
    this.running.set(false);
    cancelAnimationFrame(this.frameId);
  }

  stop(): void {
    this.running.set(false);
    cancelAnimationFrame(this.frameId);
    this.stopped = true;
  }

  reset(): void {
    this.running.set(false);
    cancelAnimationFrame(this.frameId);
    this.stopped = true;
    this.remainingMs.set(this.totalMs());
  }

  resetDefault() {
    this.running.set(false);
    cancelAnimationFrame(this.frameId);
    this.stopped = true;

    const ms = (this.defaultHours * 3600 + this.defaultMinutes * 60 + this.defaultSeconds) * 1000;
    this.totalMs.set(ms);
    this.remainingMs.set(ms);
  }

  setDuration(hours: number, minutes: number, seconds: number) {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    this.totalMs.set(totalMs);
    this.remainingMs.set(totalMs);
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = hours > 0 ?
      Math.floor((totalSeconds % 3600) / 60) :
      Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    const shortFormat =
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}.` +
      `${ms.toString().padStart(2, '0')}`;

    return hours > 0 ? `${hours.toString().padStart(2, '0')}:${shortFormat}` : shortFormat;
  }
}
