import { ChangeDetectionStrategy, Component, computed, effect, input, signal, untracked } from '@angular/core';
import { ChartPoint } from '../chart-point';
import { buildArcPath, buildDonut } from '../chart-utils';
import { animate, lerp } from '../chart-animation';
import { PercentPipe } from '@angular/common';
import { MorphArc, morphArcs, morphNumber } from '../chart-morph';
import { DEFAULT_COLORS } from '../chart-config';
import { ChartBase } from '../chart-base';

@Component({
  selector: 'app-donut-chart',
  imports: [PercentPipe],
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChart extends ChartBase {
  readonly slices = input.required<ChartPoint[]>();
  readonly size = input(180);
  readonly stroke = input(18);

  private hoverJob = 0;
  private currentAnimatedValue = 0;

  readonly renderArcs = signal<MorphArc[]>([]);
  readonly visibleCount = signal(0);
  readonly animatedTotal = signal(0);
  readonly totalScale = signal(1);
  readonly hovered = signal<string | null>(null);
  readonly hoverProgress = signal(0);

  readonly viewBox = computed(() => {
    const p = this.padding();
    const s = this.size();

    return `${-p} ${-p} ${s + p * 2} ${s + p * 2}`;
  });

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
    super();

    effect(() => {
      morphArcs(
        this.renderArcs(),
        this.arcs(),
        arcs => this.renderArcs.set(arcs),
        this.duration()
      )
    })

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
      morphNumber(
        this.currentAnimatedValue,
        this.centerValue(),
        value => {
          this.currentAnimatedValue = value;
          untracked(() => this.animatedTotal.set(value))
        },
        this.duration()
      )
    })

    effect(() => {
      this.centerValue();

      this.totalScale.set(1.08);

      setTimeout(() => {
        this.totalScale.set(1);
      }, 150);
    });
  }

  buildPath(arc: MorphArc) {
    const active = this.hovered() === arc.label;
    const offset = active ? this.hoverProgress() * 4 : 0;
    const middle = (arc.currentStart + arc.currentEnd) / 2;
    const dx = Math.cos(middle) * offset;
    const dy = Math.sin(middle) * offset;

    return buildArcPath(
      this.size() / 2 + dx,
      this.size() / 2 + dy,
      this.radius(),
      arc.currentStart,
      arc.currentEnd
    )
  }

  buildTransform(arc: MorphArc) {
    if (this.hovered() !== arc.label) return '';
    const offset = this.hoverProgress() * 8;
    const middle = (arc.currentStart + arc.currentEnd) / 2;

    return `
    translate(
      ${Math.cos(middle) * offset}
      ${Math.sin(middle) * offset}
    )
  `;
  }

  hoverEnter(id: string) {
    this.hovered.set(id);
    const job = ++this.hoverJob;

    animate(this.duration() / 2, progress => {
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
