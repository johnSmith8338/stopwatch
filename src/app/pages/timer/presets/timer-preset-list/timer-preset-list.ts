import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { TimerPreset } from '../../../../core/repositories/timer.repository';
import { TimerPresetCard } from "../timer-preset-card/timer-preset-card";
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { TimerPresetsSvc } from '../../../../services/timer-presets-svc';
import { TimerPresetsFacade } from '../timer-presets.facade';
import { TimerWorkspaceFacade } from '../../timer-workspace/timer-workspace.facade';

@Component({
  selector: 'app-timer-preset-list',
  imports: [TimerPresetCard, CdkDropList],
  templateUrl: './timer-preset-list.html',
  styleUrl: './timer-preset-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerPresetList {
  private readonly presets = inject(TimerPresetsFacade);
  readonly workspace = inject(TimerWorkspaceFacade);

  readonly timers = this.presets.timers;

  start(timer: TimerPreset) {
    this.workspace.loadPreset(timer);
  }

  edit(timer: TimerPreset) {
    this.presets.editPreset(timer);
  }

  remove(timer: TimerPreset) {
    this.presets.requestDelete(timer);
  }

  favorite(timer: TimerPreset) {
    void this.presets.toggleFavorite(timer);
  }

  async drop(event: CdkDragDrop<TimerPreset[]>) {
    await this.presets.reorder(event);
  }
}
