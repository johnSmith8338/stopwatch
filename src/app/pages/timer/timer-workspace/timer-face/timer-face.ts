import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SCALE_CENTER, SCALE_LABEL_RADIUS, SCALE_MINUTE_CENTER, SCALE_MINUTE_LABEL_RADIUS, SCALE_MINUTE_SIZE, SCALE_SIZE } from '../../../../constants/scale.constants';
import { buildFiveSecondLabels, buildLabels, buildTicks } from '../../../../utils/clock-face.util';
import { TimerInstanceStore } from '../../../../services/timer-instance.store';

@Component({
  selector: 'app-timer-face',
  imports: [],
  templateUrl: './timer-face.html',
  styleUrl: './timer-face.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--scale-size.px]': 'size',
    '[style.--scale-center.px]': 'center',
    '[style.--scale-label-radius.px]': 'labelRadius',
    '[style.--scale-minute-size.px]': 'minuteSize',
    '[style.--scale-minute-center.px]': 'minuteCenter',
    '[style.--scale-minute-label-radius.px]': 'minuteLabelRadius'
  }
})
export class TimerFace {
  private readonly store = inject(TimerInstanceStore);

  readonly size = SCALE_SIZE;
  readonly center = SCALE_CENTER;
  readonly labelRadius = SCALE_LABEL_RADIUS;

  readonly minuteSize = SCALE_MINUTE_SIZE;
  readonly minuteCenter = SCALE_MINUTE_CENTER;
  readonly minuteLabelRadius = SCALE_MINUTE_LABEL_RADIUS;

  readonly secondTicks = buildTicks(60);
  readonly minuteTicks = buildTicks(60);

  readonly secondLabels = buildLabels(
    this.center,
    this.center,
    this.labelRadius,
    buildFiveSecondLabels(0)
  )

  readonly minuteLabels = buildLabels(
    this.minuteCenter,
    this.minuteCenter,
    this.minuteLabelRadius,
    [
      { value: 0, degrees: 0 },
      { value: 15, degrees: 90 },
      { value: 30, degrees: 180 },
      { value: 45, degrees: 270 },
    ]
  )

  readonly engine = computed(() => this.store.active()?.engine ?? null);

  readonly secondProgressAngle = computed(() => this.engine()?.secondProgressAngle() ?? 0);

  readonly minuteProgressAngle = computed(() => this.engine()?.minuteProgressAngle() ?? 0);
}
