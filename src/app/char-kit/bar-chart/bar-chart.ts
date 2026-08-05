import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartPoint } from '../chart-point';
import { normalizeToPercent } from '../chart-utils';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChart {
  readonly points = input.required<ChartPoint[]>();

  readonly values = computed(() => normalizeToPercent(this.points()));
}
