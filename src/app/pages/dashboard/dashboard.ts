import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardFacade } from '../../services/dashboard.facade';
import { DashboardAlarm } from "./cards/dashboard-alarm/dashboard-alarm";
import { DashboardTimer } from "./cards/dashboard-timer/dashboard-timer";
import { DashboardStopwatch } from "./cards/dashboard-stopwatch/dashboard-stopwatch";
import { DatePipe } from '@angular/common';
import { DashboardStats } from "./cards/dashboard-stats/dashboard-stats";
import { LineChart } from "../../char-kit/line-chart/line-chart";
import { DonutChart } from "../../char-kit/donut-chart/donut-chart";
import { BarChart } from "../../char-kit/bar-chart/bar-chart";

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardAlarm,
    DashboardTimer,
    DashboardStopwatch,
    DatePipe,
    DashboardStats,
    LineChart,
    DonutChart,
    BarChart
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly facade = inject(DashboardFacade);
}
