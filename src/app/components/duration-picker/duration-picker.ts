import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WheelPicker } from "../wheel-picker/wheel-picker";

@Component({
  selector: 'app-duration-picker',
  imports: [WheelPicker],
  templateUrl: './duration-picker.html',
  styleUrl: './duration-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurationPicker {
  readonly hours = input(0);
  readonly minutes = input(0);
  readonly seconds = input(0);

  readonly disabled = input(false);

  readonly hoursChange = output<number>();
  readonly minutesChange = output<number>();
  readonly secondsChange = output<number>();

  readonly hoursItems = Array.from({ length: 24 }, (_, i) => i);
  readonly minuteItems = Array.from({ length: 60 }, (_, i) => i);
  readonly secondItems = Array.from({ length: 60 }, (_, i) => i);

  updateHours(e: Event) {
    this.hoursChange.emit(Math.max(0, Number((e.target as HTMLInputElement).value)))
  }

  updateMinutes(e: Event) {
    this.minutesChange.emit(Math.min(59, Math.max(0, Number((e.target as HTMLInputElement).value))))
  }

  updateSeconds(e: Event) {
    this.secondsChange.emit(Math.min(59, Math.max(0, Number((e.target as HTMLInputElement).value))))
  }
}
