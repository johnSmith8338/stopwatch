import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { StopwatchEngine } from '../../services/stopwatch-engine';
import { SCALE_CENTER, SCALE_MINUTE_CENTER, SCALE_MINUTE_LABEL_RADIUS, SCALE_MINUTE_SIZE, SCALE_SIZE } from '../../constants/scale.constants';
import { buildFiveSecondLabels, buildLabels, buildTicks } from '../../utils/clock-face.util';

@Component({
  selector: 'app-stopwatch-face',
  imports: [],
  templateUrl: './stopwatch-face.html',
  styleUrl: './stopwatch-face.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--scale-size.px]': 'mainSize',
    '[style.--scale-center.px]': 'mainCenter',
    '[style.--scale-label-radius.px]': 'mainRadius',
    '[style.--scale-minute-size.px]': 'minuteSize',
    '[style.--scale-minute-center.px]': 'minuteCenterX',
    '[style.--scale-minute-label-radius.px]': 'minuteRadius'
  }
})
export class StopwatchFace {
  private engineSvc = inject(StopwatchEngine);

  readonly mainSize = SCALE_SIZE;
  readonly mainCenter = SCALE_CENTER;
  readonly mainRadius = 110;

  readonly minuteSize = SCALE_MINUTE_SIZE;
  readonly minuteCenterX = SCALE_MINUTE_CENTER;
  readonly minuteCenterY = SCALE_MINUTE_CENTER;
  readonly minuteRadius = SCALE_MINUTE_LABEL_RADIUS;

  readonly fractionTicks = buildTicks(300);
  readonly secondTicks = buildTicks(60);
  readonly minuteTicks = buildTicks(60);

  readonly secondLabels = buildLabels(
    this.mainCenter,
    this.mainCenter,
    this.mainRadius,
    buildFiveSecondLabels(60)
  )

  readonly minuteLabels = buildLabels(
    this.minuteCenterX,
    this.minuteCenterY,
    this.minuteRadius,
    [
      { value: 60, degrees: 0 },
      { value: 15, degrees: 90 },
      { value: 30, degrees: 180 },
      { value: 45, degrees: 270 },
    ]
  )

  readonly secondHandAngle = computed(() => this.engineSvc.elapsedMs() / 1000 * 6);
  readonly minuteHandAngle = computed(() => this.engineSvc.elapsedMs() / 60_000 * 6);
}
