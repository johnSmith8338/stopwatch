import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimerPresetsFacade } from '../timer-presets.facade';

@Component({
  selector: 'app-preset-toolbar',
  imports: [],
  templateUrl: './preset-toolbar.html',
  styleUrl: './preset-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetToolbar {
  readonly facade = inject(TimerPresetsFacade);
}
