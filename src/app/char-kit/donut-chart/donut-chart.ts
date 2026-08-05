import { afterRenderEffect, AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, signal, viewChildren } from '@angular/core';
import { ChartPoint, DonutArc } from '../chart-point';
import { buildArcPath, buildDonut } from '../chart-utils';
import { animate, interpolateDonut, lerp } from '../chart-animation';

const DEFAULT_COLORS = [
  '#22c55e',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#a855f7',
  '#14b8a6',
  '#ec4899'
]

@Component({
  selector: 'app-donut-chart',
  imports: [],
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChart {
  readonly slices = input.required<ChartPoint[]>();
  readonly size = input(180);
  readonly stroke = input(18);
  readonly colors = input<string[]>(DEFAULT_COLORS);

  private previous: DonutArc[] = [];
  readonly renderArcs = signal<DonutArc[]>([]);

  readonly radius = computed(() => (this.size() - this.stroke()) / 2);

  readonly arcs = computed(() => buildDonut(this.slices()));

  readonly total = computed(() => this.slices().reduce((a, b) => a + b.value, 0));

  constructor() {
    afterRenderEffect(() => {
      const next = buildDonut(this.slices());

      if (!this.previous.length) {
        this.previous = structuredClone(next);
        this.renderArcs.set(next);
        return;
      }

      const old = structuredClone(this.previous);
      this.previous = structuredClone(next);

      animate(800, progress => {
        this.renderArcs.set(
          interpolateDonut(
            old,
            next,
            progress
          )
        );
      }
      );
    })
  }

  buildPath(start: number, end: number): string {
    return buildArcPath(
      this.size() / 2,
      this.size() / 2,
      this.radius(),
      start,
      end
    )
  }
}
