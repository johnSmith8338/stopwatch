import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StopwatchEngine {
  readonly elapsedMs = signal(0);
  readonly running = signal(false);
  readonly stopped = signal(false);

  readonly formatedTime = computed(() => this.formatTime(this.elapsedMs()));
  readonly displayTime = computed(() => {
    const ms = this.elapsedMs();
    return this.formatTime(Math.floor(ms / 10) * 10);
  })

  private frameId = 0;
  private startTimestamp = 0;
  private pauseElapsed = 0;

  start() {
    if (this.running()) return;

    if (this.stopped()) {
      this.elapsedMs.set(0);
      this.pauseElapsed = 0;
    }

    this.stopped.set(false);
    this.running.set(true);
    this.startTimestamp = performance.now() - this.pauseElapsed;

    const tick = () => {
      if (!this.running()) return;
      this.elapsedMs.set(performance.now() - this.startTimestamp);
      this.frameId = requestAnimationFrame(tick);
    }
    tick();
  }

  pause() {
    if (!this.running()) return;
    this.running.set(false);
    cancelAnimationFrame(this.frameId);
    this.pauseElapsed = this.elapsedMs();
  }

  stop() {
    this.running.set(false);
    this.stopped.set(true);
    cancelAnimationFrame(this.frameId);
    this.pauseElapsed = this.elapsedMs();
  }

  reset() {
    this.running.set(false);
    cancelAnimationFrame(this.frameId);
    this.elapsedMs.set(0);
    this.pauseElapsed = 0;
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = hours > 0 ?
      Math.floor((totalSeconds % 3600) / 60) :
      Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    const shortFormat =
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}.` +
      `${ms.toString().padStart(2, '0')}`;

    return hours > 0 ? `${hours.toString().padStart(2, '0')}:${shortFormat}` : shortFormat;
  }
}
