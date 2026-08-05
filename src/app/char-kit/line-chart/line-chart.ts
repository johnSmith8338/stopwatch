import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import { ChartPoint } from '../chart-point';
import { buildArea, buildPoints, buildPolyline } from '../chart-utils';

@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChart implements AfterViewInit {
  readonly points = input.required<ChartPoint[]>();
  readonly width = input(320);
  readonly height = input(320);

  readonly lineRef = viewChild<ElementRef<SVGPolylineElement>>('line');

  readonly visiblePoints = signal<boolean[]>([]);

  readonly gradientId = `gradient-${crypto.randomUUID()}`;

  readonly polyline = computed(() => buildPolyline(this.svgPoints()));

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

  readonly totalLength = computed(() => {
    const pts = this.svgPoints();
    if (!pts.length) return 0;
    return pts.at(-1)!.length;
  })

  ngAfterViewInit(): void {
    queueMicrotask(() => this.animatePoints());
  }

  private animatePoints() {
    const points = this.svgPoints();
    const total = this.totalLength();
    const start = performance.now();
    const duration = 800;
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / duration);
      const currentLength = total * progress;

      this.visiblePoints.set(points.map(point => point.length <= currentLength));

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }
}
