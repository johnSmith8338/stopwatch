import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { ChartPoint, SvgPoint } from '../chart-point';
import { buildPoints, buildPolyline } from '../chart-utils';
import { ChartBase } from '../chart-base';
import { MorphPoint, morphPoints } from '../chart-morph';

@Component({
  selector: 'app-mini-sparkline',
  imports: [],
  templateUrl: './mini-sparkline.html',
  styleUrl: './mini-sparkline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniSparkline extends ChartBase {
  readonly points = input.required<ChartPoint[]>();
  readonly width = input(120);
  readonly height = input(48);

  readonly gradientId = `spark-${crypto.randomUUID()}`;

  readonly hovered = signal<MorphPoint | null>(null);
  readonly renderPoints = signal<MorphPoint[]>([]);

  readonly isGrowing = computed(() => {
    const points = this.points();
    if (points.length < 2) return true;
    return points.at(-1)!.value >= points[0].value;
  });

  readonly gradientStart = computed(() => this.colors()[0]);

  readonly gradientEnd = computed(() => this.colors()[1] ?? this.colors()[0]);

  readonly hoveredPercent = computed(() => {
    const point = this.hovered();
    if (!point) return 0;

    const total = this.points().reduce((s, p) => s + p.value, 0);
    return Math.round(point.value / total * 100);
  });

  readonly geometry = computed(() => buildPoints(
    this.points(),
    this.width(),
    this.height()
  ))

  readonly polyline = computed(() => buildPolyline(this.renderPoints()));

  readonly lastPoint = computed(() => this.renderPoints().at(-1));

  readonly trend = computed(() => {
    const pts = this.points();
    if (pts.length < 2) return 'flat';

    const first = pts[0].value;
    const last = pts.at(-1)!.value;

    return last > first ? 'up' : last < first ? 'down' : 'flat';
  })

  readonly lineColor = computed(() => {
    switch (this.trend()) {
      case 'up': return '#22c55e';
      case 'down': return '#ef4444';
      default: return '#94a3b8'
    }
  })

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

  hover(point: MorphPoint) {
    this.hovered.set(point);
  }

  leave() {
    this.hovered.set(null);
  }
}
