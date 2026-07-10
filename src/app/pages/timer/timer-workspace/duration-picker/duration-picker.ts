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
  settings = this.facade.appSettings;

  readonly hoursItems = Array.from({ length: 24 }, (_, i) => i);
  readonly minuteItems = Array.from({ length: 60 }, (_, i) => i);
  readonly secondItems = Array.from({ length: 60 }, (_, i) => i);

  disabled = computed(() =>
    this.facade.preview.running() || this.facade.dialogOpened()
  )

  updateHours(event: Event) {
    const value = Math.max(
      0,
      Number((event.target as HTMLInputElement).value)
    );

    this.facade.updateHours(value);
  }

  updateMinutes(event: Event) {
    const value = Math.min(
      59,
      Math.max(0, Number((event.target as HTMLInputElement).value))
    );

    this.facade.updateMinutes(value);
  }

  updateSeconds(event: Event) {
    const value = Math.min(
      59,
      Math.max(0, Number((event.target as HTMLInputElement).value))
    );

    this.facade.updateSeconds(value);
  }
}
