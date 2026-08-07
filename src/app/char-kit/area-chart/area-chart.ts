import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { ChartPoint } from '../chart-point';
import { MorphPoint, morphPoints } from '../chart-morph';
import { buildAnimatedArea, buildPoints, buildPolyline } from '../chart-utils';
import { ChartBase } from '../chart-base';

@Component({
  selector: 'app-area-chart',
  imports: [],
  templateUrl: './area-chart.html',
  styleUrl: './area-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChart extends ChartBase {
  readonly points = input.required<ChartPoint[]>();
  readonly width = input(120);
  readonly height = input(120);

  readonly gradientId = `area-${crypto.randomUUID()}`;

  readonly renderPoints = signal<MorphPoint[]>([]);

  readonly geometry = computed(() => buildPoints(
    this.points(),
    this.width(),
    this.height(),
    this.padding()
  ))

  readonly polyline = computed(() => buildPolyline(this.renderPoints()));

  readonly area = computed(() => buildAnimatedArea(
    this.renderPoints(),
    this.height(),
    this.padding()
  ))

  constructor() {
    super();

    effect(() => {
      morphPoints(
        this.renderPoints(),
        this.geometry(),
        points => this.renderPoints.set(points),
        this.duration()
      )
    })
  }
}
