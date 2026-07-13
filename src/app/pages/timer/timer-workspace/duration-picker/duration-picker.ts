import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { WheelPicker } from "../../../../components/wheel-picker/wheel-picker";
import { TimerWorkspaceFacade } from '../timer-workspace.facade';

@Component({
  selector: 'app-duration-picker',
  imports: [WheelPicker],
  templateUrl: './duration-picker.html',
  styleUrl: './duration-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurationPicker {
  readonly facade = inject(TimerWorkspaceFacade);
  settings = this.facade.draft.settings;

  readonly hoursItems = Array.from({ length: 24 }, (_, i) => i);
  readonly minuteItems = Array.from({ length: 60 }, (_, i) => i);
  readonly secondItems = Array.from({ length: 60 }, (_, i) => i);

  disabled = computed(() =>
    this.facade.draft.running() || this.facade.dialogOpened()
  )

  updateHours(event: Event) {
    this.facade.draft.setHours(Number((event.target as HTMLInputElement).value));
  }

  updateMinutes(event: Event) {
    this.facade.draft.setMinutes(Number((event.target as HTMLInputElement).value));
  }

  updateSeconds(event: Event) {
    this.facade.draft.setSeconds(Number((event.target as HTMLInputElement).value));
  }
}
