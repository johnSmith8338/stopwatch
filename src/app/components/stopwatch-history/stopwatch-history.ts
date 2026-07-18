import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { StopwatchHistorySvc } from '../../services/stopwatch-history-svc';
import { LapSession } from '../../core/repositories/stopwatch.repository';
import { DatePipe } from '@angular/common';
import { ConfirmDialog } from "../confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-stopwatch-history',
  imports: [DatePipe, ConfirmDialog],
  templateUrl: './stopwatch-history.html',
  styleUrl: './stopwatch-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchHistory {
  private readonly historySvc = inject(StopwatchHistorySvc);

  readonly sessions = signal<LapSession[]>([]);
  readonly deletingSession = signal<string | null>(null);
  readonly clearing = signal(false);

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

  requestDelete(id: string) {
    this.deletingSession.set(id);
  }

  cancelDelete() {
    this.deletingSession.set(null);
  }

  async confirmDelete() {
    const id = this.deletingSession();
    if (!id) return;

    await this.historySvc.deleteSession(id);
    this.deletingSession.set(null);
    await this.reload();
  }

  requestClear() {
    this.clearing.set(true);
  }

  cancelClear() {
    this.clearing.set(false);
  }

  async confirmClear() {
    await this.historySvc.clear();
    this.sessions.set([]);
    this.clearing.set(false);
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
