import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TimerPreset } from '../../core/repositories/timer.repository';
import { TimerPresetCard } from "../timer-preset-card/timer-preset-card";
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { TimerPresetsSvc } from '../../services/timer-presets-svc';

@Component({
  selector: 'app-timer-preset-list',
  imports: [TimerPresetCard, CdkDropList],
  templateUrl: './timer-preset-list.html',
  styleUrl: './timer-preset-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPresetList {
  private readonly presetsSvc = inject(TimerPresetsSvc);

  readonly timers = input.required<TimerPreset[]>();

  readonly edit = output<TimerPreset>();
  readonly start = output<TimerPreset>();
  readonly remove = output<string>();
  readonly favorite = output<TimerPreset>();
  readonly reorder = output<CdkDragDrop<TimerPreset[]>>();

  async drop(event: CdkDragDrop<TimerPreset[]>) {
    await this.presetsSvc.reorder(
      event.previousIndex,
      event.currentIndex
    )
  }
}
