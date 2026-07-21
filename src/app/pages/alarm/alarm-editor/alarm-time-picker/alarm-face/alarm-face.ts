import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { AlarmFaceEngine } from '../../../../../models/alarm-face-engine.interface';
import { AlarmDialStep } from '../../../../../models/alarm-dial-step.interface';
import { SCALE_CENTER, SCALE_LABEL_RADIUS, SCALE_SIZE } from '../../../../../constants/scale.constants';
import { buildLabels, buildTicks } from '../../../../../utils/clock-face.util';
import { AlarmTimeUnit } from '../../../../../models/alarm-time-unit.type';
import { AlarmDialEditor } from "../../../../../directives/alarm-dial-editor";

@Component({
  selector: 'app-alarm-face',
  imports: [AlarmDialEditor],
  templateUrl: './alarm-face.html',
  styleUrl: './alarm-face.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--scale-size.px]': 'size',
    '[style.--scale-center.px]': 'center'
  }
})
export class AlarmFace {
  readonly engine = input.required<AlarmFaceEngine>();
  readonly dialStep = output<AlarmDialStep>();
  readonly dialFinished = output();

  readonly mode = input.required<AlarmTimeUnit>();

  readonly size = SCALE_SIZE;
  readonly center = SCALE_CENTER;
  readonly radius = SCALE_LABEL_RADIUS;

  readonly ticks = buildTicks(60);

  readonly hourLabels = buildLabels(
    this.center,
    this.center,
    this.radius,
    [
      { value: 12, degrees: 0 },
      { value: 1, degrees: 30 },
      { value: 2, degrees: 60 },
      { value: 3, degrees: 90 },
      { value: 4, degrees: 120 },
      { value: 5, degrees: 150 },
      { value: 6, degrees: 180 },
      { value: 7, degrees: 210 },
      { value: 8, degrees: 240 },
      { value: 9, degrees: 270 },
      { value: 10, degrees: 300 },
      { value: 11, degrees: 330 }
    ]
  )

  readonly minuteLabels = buildLabels(
    this.center,
    this.center,
    this.radius,
    [
      { value: 0, degrees: 0 },
      { value: 5, degrees: 30 },
      { value: 10, degrees: 60 },
      { value: 15, degrees: 90 },
      { value: 20, degrees: 120 },
      { value: 25, degrees: 150 },
      { value: 30, degrees: 180 },
      { value: 35, degrees: 210 },
      { value: 40, degrees: 240 },
      { value: 45, degrees: 270 },
      { value: 50, degrees: 300 },
      { value: 55, degrees: 330 }
    ]
  )

  readonly handAngle = computed(() =>
    this.mode() === 'hour' ? this.engine().hour() * 30 : this.engine().minute() * 6
  )

  readonly knobValue = computed(() =>
    this.mode() === 'hour'
      ? this.engine().hour()
      : this.engine().minute().toString().padStart(2, '0')
  );
}
