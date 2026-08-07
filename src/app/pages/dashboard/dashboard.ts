import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DashboardFacade } from '../../services/dashboard.facade';
import { DashboardAlarm } from "./cards/dashboard-alarm/dashboard-alarm";
import { DashboardTimer } from "./cards/dashboard-timer/dashboard-timer";
import { DashboardStopwatch } from "./cards/dashboard-stopwatch/dashboard-stopwatch";
import { DatePipe } from '@angular/common';
import { ChartPoint } from '../../char-kit/chart-point';
import { LineChart } from "../../char-kit/line-chart/line-chart";
import { BarChart } from "../../char-kit/bar-chart/bar-chart";
import { DonutChart } from "../../char-kit/donut-chart/donut-chart";
import { MiniSparkline } from "../../char-kit/mini-sparkline/mini-sparkline";

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardAlarm,
    DashboardTimer,
    DashboardStopwatch,
    DatePipe,
    LineChart,
    BarChart,
    DonutChart,
    MiniSparkline
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly facade = inject(DashboardFacade);

  activity = signal<ChartPoint[]>([
    { label: 'Mon', value: 4 },
    { label: 'Tue', value: 7 },
    { label: 'Wed', value: 2 },
    { label: 'Thu', value: 9 },
    { label: 'Fri', value: 6 },
    { label: 'Sat', value: 12 },
    { label: 'Sun', value: 8 }
  ]);

  bars = signal([
    { label: 'Mon', value: 3 },
    { label: 'Tue', value: 7 },
    { label: 'Wed', value: 5 },
    { label: 'Thu', value: 10 },
    { label: 'Fri', value: 8 },
    { label: 'Sat', value: 2 },
    { label: 'Sun', value: 6 },
  ]);

  readonly donut = signal([
    {
      label: 'finished',
      value: 12
    },
    {
      label: 'cancelled',
      value: 8
    },
    {
      label: 'missed',
      value: 6
    }
  ]);
}
