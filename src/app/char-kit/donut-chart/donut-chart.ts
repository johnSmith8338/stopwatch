import { afterRenderEffect, AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, signal, untracked, viewChildren } from '@angular/core';
import { ChartPoint, DonutArc } from '../chart-point';
import { buildArcPath, buildDonut } from '../chart-utils';
import { animate, interpolateDonut, lerp } from '../chart-animation';
import { PercentPipe } from '@angular/common';

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
  imports: [PercentPipe],
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
  private hoverJob = 0;
  readonly padding = 16;
  private currentAnimatedValue = 0;

  readonly renderArcs = signal<DonutArc[]>([]);
  readonly visibleCount = signal(0);
  readonly animatedTotal = signal(0);
  readonly totalScale = signal(1);
  readonly hovered = signal<string | null>(null);
  readonly hoverProgress = signal(0);

  readonly radius = computed(() => (this.size() - this.stroke()) / 2);

  readonly arcs = computed(() => buildDonut(this.slices()));

  readonly selectedArc = computed(() => {
    const id = this.hovered();
    if (!id) return null;

    return this.arcs().find(a => a.label === id) ?? null;
  })

  readonly centerValue = computed(() => {
    const selected = this.selectedArc();
    return selected ? selected.value : this.slices().reduce((a, b) => a + b.value, 0);
  })

  readonly centerLabel = computed(() => {
    const selected = this.selectedArc();
    return selected ? selected.label : 'total'
  })

  constructor() {
    effect(() => {
      const next = this.arcs();

      if (!this.previous.length) {
        this.previous = structuredClone(next);
        this.renderArcs.set(next);
        return;
      }

      const old = structuredClone(this.previous);
      this.previous = structuredClone(next);

      animate(700, progress => {
        untracked(() => {
          this.renderArcs.set(
            interpolateDonut(
              old,
              next,
              progress
            )
          );
        });
      });
    });

    effect(() => {
      const arcs = this.arcs();
      if (!arcs.length) return;

      this.visibleCount.set(0);

      let i = 0;

      const next = () => {
        this.visibleCount.set(++i);

        if (i < arcs.length) {
          setTimeout(next, 180);
        }
      };

      setTimeout(next, 100);
    });

    effect(() => {
      const target = this.centerValue();
      const start = this.currentAnimatedValue;

      animate(400, progress => {
        const value = Math.round(lerp(start, target, progress));
        this.currentAnimatedValue = value;
        untracked(() => {
          this.animatedTotal.set(value);
        })
      })
    })

    effect(() => {
      this.centerValue();

      this.totalScale.set(1.08);

      setTimeout(() => {
        this.totalScale.set(1);
      }, 150);
    });
  }

  buildPath(arc: DonutArc) {
    const active = this.hovered() === arc.label;
    const offset = active ? this.hoverProgress() * 4 : 0;
    const middle = (arc.startAngle + arc.endAngle) / 2;
    const dx = Math.cos(middle) * offset;
    const dy = Math.sin(middle) * offset;

    return buildArcPath(
      this.size() / 2 + dx,
      this.size() / 2 + dy,
      this.radius(),
      arc.startAngle,
      arc.endAngle
    )
  }

  hoverEnter(id: string) {
    this.hovered.set(id);
    const job = ++this.hoverJob;

    animate(200, progress => {
      if (job !== this.hoverJob) return;
      this.hoverProgress.set(progress);
    })
  }

  hoverLeave() {
    const job = ++this.hoverJob;

    animate(200, progress => {
      if (job !== this.hoverJob) return;
      this.hoverProgress.set(1 - progress);
    }, () => {
      if (job !== this.hoverJob) return;
      this.hovered.set(null);
    })
  }
}
