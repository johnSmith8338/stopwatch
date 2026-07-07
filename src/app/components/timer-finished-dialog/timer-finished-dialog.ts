import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimerPreset } from '../../core/repositories/timer.repository';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-timer-finished-dialog',
  imports: [DecimalPipe],
  templateUrl: './timer-finished-dialog.html',
  styleUrl: './timer-finished-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerFinishedDialog {
  readonly preset = input.required<TimerPreset>();
  readonly stop = output();
  readonly repeat = output();
}
