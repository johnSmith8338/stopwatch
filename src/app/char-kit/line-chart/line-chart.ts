import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { ChartPoint } from '../chart-point';
import { buildArea, buildPoints, buildPolyline } from '../chart-utils';
import { MorphPoint, morphPoints } from '../chart-morph';
import { ChartBase } from '../chart-base';

@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChart extends ChartBase implements AfterViewInit {
  readonly points = input.required<ChartPoint[]>();
  readonly width = input(320);
  readonly height = input(320);

  readonly lineRef = viewChild<ElementRef<SVGPolylineElement>>('line');

  readonly visiblePoints = signal<boolean[]>([]);
  readonly renderPoints = signal<MorphPoint[]>([]);

  readonly gradientId = `gradient-${crypto.randomUUID()}`;

  readonly svgPoints = computed(() => buildPoints(
    this.points(),
    this.width(),
    this.height()
  ))

  readonly polyline = computed(() => buildPolyline(this.renderPoints()));

  readonly area = computed(() =>
    buildArea(
      this.points(),
      this.width(),
      this.height()
    )
  );

  readonly totalLength = computed(() => {
    const pts = this.svgPoints();
    if (!pts.length) return 0;
    return pts.at(-1)!.length;
  })

  constructor() {
    super();

    effect(() => {
      morphPoints(
        this.renderPoints(),
        this.svgPoints(),
        points => this.renderPoints.set(points),
        this.duration()
      )
    })
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.animatePoints());
  }

  private animatePoints() {
    const points = this.svgPoints();
    const total = this.totalLength();
    const start = performance.now();
    const duration = this.duration();
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / duration);
      const currentLength = total * progress;

      this.visiblePoints.set(points.map(point => point.length <= currentLength));

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }
}
