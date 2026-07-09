import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TimerPreset } from '../../core/repositories/timer.repository';
import { DecimalPipe } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { SvgIcon } from "../../directives/svg-icon";

@Component({
  selector: 'app-timer-preset-card',
  imports: [DecimalPipe, CdkDrag, CdkDragHandle, SvgIcon],
  templateUrl: './timer-preset-card.html',
  styleUrl: './timer-preset-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPresetCard {
  readonly timer = input.required<TimerPreset>();

  readonly start = output<TimerPreset>();
  readonly edit = output<TimerPreset>();
  readonly remove = output<TimerPreset>();
  readonly favorite = output<TimerPreset>();
}
