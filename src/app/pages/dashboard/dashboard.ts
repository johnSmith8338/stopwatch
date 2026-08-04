import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardFacade } from '../../services/dashboard.facade';
import { DashboardAlarm } from "./cards/dashboard-alarm/dashboard-alarm";
import { DashboardTimer } from "./cards/dashboard-timer/dashboard-timer";
import { DashboardStopwatch } from "./cards/dashboard-stopwatch/dashboard-stopwatch";

@Component({
  selector: 'app-dashboard',
  imports: [DashboardAlarm, DashboardTimer, DashboardStopwatch],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly facade = inject(DashboardFacade);
}
