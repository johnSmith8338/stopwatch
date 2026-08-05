import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartPoint } from '../chart-point';
import { buildArea, buildPoints, buildPolyline } from '../chart-utils';

@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChart {
  readonly points = input.required<ChartPoint[]>();
  readonly width = input(320);
  readonly height = input(320);

  readonly gradientId = `gradient-${crypto.randomUUID()}`;
  readonly polyline = computed(() => buildPolyline(
    this.points(),
    this.width(),
    this.height()
  ))

  readonly svgPoints = computed(() => buildPoints(
    this.points(),
    this.width(),
    this.height()
  ))

  readonly area = computed(() =>
    buildArea(
      this.points(),
      this.width(),
      this.height()
    )
  );
}
