import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TimerEngine } from '../../services/timer-engine';
import { SCALE_CENTER, SCALE_LABEL_RADIUS, SCALE_MINUTE_CENTER, SCALE_MINUTE_LABEL_RADIUS, SCALE_MINUTE_SIZE, SCALE_SIZE } from '../../constants/scale.constants';

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
  readonly engineSvc = inject(TimerEngine);

  readonly secondTicks = Array.from({ length: 60 }, (_, i) => i);
  readonly size = SCALE_SIZE;
  readonly center = SCALE_CENTER;
  readonly labelRadius = SCALE_LABEL_RADIUS;

  readonly minuteSize = SCALE_MINUTE_SIZE;
  readonly minuteCenter = SCALE_MINUTE_CENTER;
  readonly minuteLabelRadius = SCALE_MINUTE_LABEL_RADIUS;
  readonly minuteTicks = Array.from({ length: 60 }, (_, i) => i);

  readonly secondLabels = Array.from(
    { length: 12 },
    (_, i) => {
      const value = i === 0 ? 0 : i * 5;
      const radians = (i * 30 - 90) * Math.PI / 180;
      return {
        value,
        x: this.center + this.labelRadius * Math.cos(radians),
        y: this.center + this.labelRadius * Math.sin(radians),
      }
    }
  )

  readonly minuteLabels = [
    { value: 0, degrees: 0 },
    { value: 15, degrees: 90 },
    { value: 30, degrees: 180 },
    { value: 45, degrees: 270 },
  ].map(label => {
    const radians = (label.degrees - 90) * Math.PI / 180;

    return {
      value: label.value,
      x: this.minuteCenter + this.minuteLabelRadius * Math.cos(radians),
      y: this.minuteCenter + this.minuteLabelRadius * Math.sin(radians),
    };
  });

  readonly progressAngle = computed(() => {
    const total = this.engineSvc.totalMs();
    if (!total) return 0;

    const progress = this.engineSvc.remainingMs() / total;
    return progress * 360;
  })

  readonly minuteProgressAngle = computed(() => {
    const totalMinutes = this.engineSvc.totalMs() / 60_000;
    if (!totalMinutes) return 0;

    const remainingMinutes = this.engineSvc.remainingMs() / 60_000;
    return remainingMinutes / totalMinutes * 360;
  });
}
