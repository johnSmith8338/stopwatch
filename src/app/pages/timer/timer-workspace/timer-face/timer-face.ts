import { ChangeDetectionStrategy, Component, computed, input, output, Signal } from '@angular/core';
import { SCALE_CENTER, SCALE_LABEL_RADIUS, SCALE_MINUTE_CENTER, SCALE_MINUTE_LABEL_RADIUS, SCALE_MINUTE_SIZE, SCALE_SIZE } from '../../../../constants/scale.constants';
import { buildFiveSecondLabels, buildLabels, buildTicks } from '../../../../utils/clock-face.util';
import { DialChange, TimerDialEditor } from "../../../../directives/timer-dial-editor";

export interface TimerFaceEngine {
  secondProgressAngle: Signal<number>;
  minuteProgressAngle: Signal<number>;
}

export type TimerFaceMode = 'display' | 'editor';

@Component({
  selector: 'app-timer-face',
  imports: [TimerDialEditor],
  templateUrl: './timer-face.html',
  styleUrl: './timer-face.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--scale-size.px]': 'size',
    '[style.--scale-center.px]': 'center',
    '[style.--scale-label-radius.px]': 'labelRadius',
    '[style.--scale-minute-size.px]': 'minuteSize',
    '[style.--scale-minute-center.px]': 'minuteCenter',
    '[style.--scale-minute-label-radius.px]': 'minuteLabelRadius',
  }
})
export class TimerFace {
  readonly engine = input.required<TimerFaceEngine>();
  readonly mode = input<TimerFaceMode>('display');

  readonly secondsChange = output<number>();
  readonly minutesChange = output<number>();

  readonly minutesIncrement = output();
  readonly minutesDecrement = output();

  readonly hoursIncrement = output();
  readonly hoursDecrement = output();

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

  secondProgressAngle = computed(() => this.engine().secondProgressAngle());
  minuteProgressAngle = computed(() => this.engine().minuteProgressAngle());

  secondDragged(change: DialChange) {
    this.secondsChange.emit(change.current);
    const delta = change.current - change.previous;
    if (delta < -30) this.minutesIncrement.emit();
    if (delta > 30) this.minutesDecrement.emit();
  }

  minuteDragged(change: DialChange) {
    this.minutesChange.emit(change.current);
    const delta = change.current - change.previous;
    if (delta < -30) this.hoursIncrement.emit();
    if (delta > 30) this.hoursDecrement.emit();
  }
}
