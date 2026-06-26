import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { StopwatchEngine } from '../../services/stopwatch-engine';
import { SCALE_CENTER, SCALE_MINUTE_CENTER, SCALE_MINUTE_LABEL_RADIUS, SCALE_MINUTE_SIZE, SCALE_SIZE } from '../../constants/scale.constants';

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

  readonly fractionTicks = Array.from(
    { length: 300 },
    (_, i) => i
  )

  readonly secondTicks = Array.from(
    { length: 60 },
    (_, i) => i
  )

  readonly minuteTicks = Array.from(
    { length: 60 },
    (_, i) => i
  )

  readonly secondHandAngle = computed(() => {
    const seconds = this.engineSvc.elapsedMs() / 1000;
    return seconds * 6;
  })

  readonly minuteHandleAngle = computed(() => {
    const totalMinutes = this.engineSvc.elapsedMs() / 60_000;
    return totalMinutes * 6;
  })

  readonly secondLabels = Array.from(
    { length: 12 },
    (_, i) => {
      const value = i === 0 ? 60 : i * 5;
      const degrees = i * 30;
      const radians = (degrees - 90) * Math.PI / 180;

      return {
        value,
        x: this.mainCenter + this.mainRadius * Math.cos(radians),
        y: this.mainCenter + this.mainRadius * Math.sin(radians),
      };
    }
  );

  readonly minuteLabels = [
    { value: 60, degrees: 0 },
    { value: 15, degrees: 90 },
    { value: 30, degrees: 180 },
    { value: 45, degrees: 270 },
  ].map(label => {
    const radians = (label.degrees - 90) * Math.PI / 180;

    return {
      value: label.value,
      x: this.minuteCenterX + this.minuteRadius * Math.cos(radians),
      y: this.minuteCenterY + this.minuteRadius * Math.sin(radians),
    };
  });
}
