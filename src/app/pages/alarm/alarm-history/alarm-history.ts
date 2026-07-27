import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlarmHistoryFacade } from '../../../services/alarm-history.facade';
import { AlarmHistoryStatus } from '../../../models/alarm-history.interface';

@Component({
  selector: 'app-alarm-history',
  imports: [],
  templateUrl: './alarm-history.html',
  styleUrl: './alarm-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmHistory {
  readonly facade = inject(AlarmHistoryFacade);

  readonly history = this.facade.history;
  readonly total = this.facade.total;
  readonly rings = this.facade.rings;
  readonly stops = this.facade.stops;
  readonly snoozes = this.facade.snoozes;
  readonly missed = this.facade.missed;

  clear() {
    this.facade.clear();
  }

  formatTime(timesmap: number) {
    return new Date(timesmap).toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  readonly statusMap: Record<AlarmHistoryStatus, string> = {
    ring: '🔔 ring',
    stop: '🛑 stopped',
    snooze: '😴 snoozed',
    missed: '💀 missed'
  }
}
