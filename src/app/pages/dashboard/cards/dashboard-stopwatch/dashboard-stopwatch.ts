import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardFacade } from '../../../../services/dashboard.facade';

@Component({
  selector: 'app-dashboard-stopwatch',
  imports: [],
  templateUrl: './dashboard-stopwatch.html',
  styleUrl: './dashboard-stopwatch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStopwatch {
  readonly facade = inject(DashboardFacade);

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
