import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { AnimatedPoint, ChartPoint, SvgPoint } from '../chart-point';
import { buildPoints, buildPolyline } from '../chart-utils';
import { animate, lerp, morphPoints } from '../chart-animation';

@Component({
  selector: 'app-mini-sparkline',
  imports: [],
  templateUrl: './mini-sparkline.html',
  styleUrl: './mini-sparkline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniSparkline {
  readonly points = input.required<ChartPoint[]>();
  readonly width = input(120);
  readonly height = input(48);

  readonly gradientId = `spark-${crypto.randomUUID()}`;

  readonly hovered = signal<AnimatedPoint | null>(null);
  readonly renderPoints = signal<AnimatedPoint[]>([]);

  readonly isGrowing = computed(() => {
    const points = this.points();
    if (points.length < 2) return true;
    return points.at(-1)!.value >= points[0].value;
  });

  readonly gradientStart = computed(() =>
    this.isGrowing()
      ? '#16a34a'
      : '#dc2626'
  );

  readonly gradientEnd = computed(() =>
    this.isGrowing()
      ? '#4ade80'
      : '#fb7185'
  );

  readonly hoveredPercent = computed(() => {
    const point = this.hovered();
    if (!point) return 0;

    const total = this.points().reduce((s, p) => s + p.value, 0);
    return Math.round(point.value / total * 100);
  });

  readonly targetPoints = computed(() => buildPoints(
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
    effect(() => {
      const target = this.targetPoints();
      morphPoints(
        this.renderPoints(),
        target,
        points => this.renderPoints.set(points)
      )
    })
  }
}
