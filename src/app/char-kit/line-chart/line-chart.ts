import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { AnimatedPoint, ChartPoint } from '../chart-point';
import { buildArea, buildPoints, buildPolyline } from '../chart-utils';
import { animate, lerp } from '../chart-animation';

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

  private previous: AnimatedPoint[] = [];

  readonly visiblePoints = signal<boolean[]>([]);
  readonly renderPoints = signal<AnimatedPoint[]>([]);

  readonly gradientId = `gradient-${crypto.randomUUID()}`;

  readonly polyline = computed(() => buildPolyline(
    this.renderPoints().map(p => ({
      ...p,
      x: p.currentX,
      y: p.currentY
    }))
  )
  );

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

  constructor() {
    effect(() => {
      const next = this.svgPoints();

      if (!this.previous.length) {
        const initial = next.map(p => ({
          ...p,
          currentX: p.x,
          currentY: p.y
        }));

        this.previous = structuredClone(initial);
        this.renderPoints.set(initial);
        return;
      }

      const old = structuredClone(this.previous);

      animate(700, progress => {
        const animated = next.map((point, i) => {
          const prev = old[i] ?? {
            ...point,
            currentX: point.x,
            currentY: point.y
          };

          return {
            ...point,
            currentX: lerp(prev.currentX, point.x, progress),
            currentY: lerp(prev.currentY, point.y, progress)
          };
        });

        this.renderPoints.set(animated);
      }, () => {
        this.previous = structuredClone(this.renderPoints());
      });
    });
  }

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
