import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardFacade } from '../../services/dashboard.facade';
import { DashboardAlarm } from "./cards/dashboard-alarm/dashboard-alarm";
import { DashboardTimer } from "./cards/dashboard-timer/dashboard-timer";
import { DashboardStopwatch } from "./cards/dashboard-stopwatch/dashboard-stopwatch";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardAlarm,
    DashboardTimer,
    DashboardStopwatch,
    DatePipe,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly facade = inject(DashboardFacade);
}
