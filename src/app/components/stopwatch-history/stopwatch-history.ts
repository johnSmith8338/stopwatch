import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { StopwatchHistorySvc } from '../../services/stopwatch-history-svc';
import { LapSession } from '../../core/repositories/stopwatch.repository';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stopwatch-history',
  imports: [DatePipe],
  templateUrl: './stopwatch-history.html',
  styleUrl: './stopwatch-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchHistory {
  private readonly historySvc = inject(StopwatchHistorySvc);

  readonly sessions = signal<LapSession[]>([]);

  constructor() {
    effect(() => {
      this.historySvc.changed();
      void this.reload();
    })
  }

  async reload() {
    this.sessions.set(await this.historySvc.getHistory());
  }

  async delete(id: string) {
    await this.historySvc.deleteSession(id);
    await this.reload();
  }

  async clear() {
    await this.historySvc.clear();
    this.sessions.set([]);
  }

  format(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = hours > 0 ?
      Math.floor((totalSeconds % 3600) / 60) :
      Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    const short =
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}:` +
      `${centiseconds.toString().padStart(2, '0')}`;

    return hours ? `${hours.toString().padStart(2, '0')}:${short}` : short;
  }
}
