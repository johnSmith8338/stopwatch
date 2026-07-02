import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { TimerEngine } from '../../services/timer-engine';
import { Controls } from "../../components/controls/controls";
import { DigitalDisplay } from "../../components/digital-display/digital-display";
import { WheelPicker } from "../../components/wheel-picker/wheel-picker";
import { TimerFace } from "../../components/timer-face/timer-face";
import { TimerSvc } from '../../services/timer-svc';

@Component({
  selector: 'app-timer',
  imports: [Controls, DigitalDisplay, WheelPicker, TimerFace],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timer {
  readonly engineSvc = inject(TimerEngine);
  private readonly timerSvc = inject(TimerSvc);

  readonly hours = signal(this.engineSvc.defaultHours);
  readonly minutes = signal(this.engineSvc.defaultMinutes);
  readonly seconds = signal(this.engineSvc.defaultSeconds);

  readonly hoursItems = Array.from({ length: 24 }, (_, i) => i);
  readonly minuteItems = Array.from({ length: 60 }, (_, i) => i);
  readonly secondItems = Array.from({ length: 60 }, (_, i) => i);

  private restored = false;

  constructor() {
    effect(() => {
      if (!this.restored) return;

      const hours = this.hours();
      const minutes = this.minutes();
      const seconds = this.seconds();

      this.engineSvc.setDuration(hours, minutes, seconds)

      void this.timerSvc.save(hours, minutes, seconds)
    })

    void this.restore();
  }

  updateValue(type: 'hours' | 'minutes' | 'seconds', event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    const safeValue = Number.isNaN(value) ? 0 : Math.max(0, value);

    switch (type) {
      case 'hours':
        this.hours.set(safeValue);
        break;
      case 'minutes':
        this.minutes.set(Math.min(59, safeValue));
        break;
      case 'seconds':
        this.seconds.set(Math.min(59, safeValue));
        break;
    }
  }

  resetDefault() {
    const defaults = this.engineSvc.getDefaults();

    this.hours.set(defaults.hours);
    this.minutes.set(defaults.minutes);
    this.seconds.set(defaults.seconds);

    this.engineSvc.resetDefault();
  }

  updateHours(value: number) {
    this.hours.set(value);
    this.applyTimer();
  }

  updateMinutes(value: number) {
    this.minutes.set(value);
    this.applyTimer();
  }

  updateSeconds(value: number) {
    this.seconds.set(value);
    this.applyTimer();
  }

  private applyTimer() {
    const hours = this.hours();
    const minutes = this.minutes();
    const seconds = this.seconds();

    this.engineSvc.setDuration(hours, minutes, seconds);

    void this.timerSvc.save(hours, minutes, seconds);
  }

  private async restore() {
    const timer = await this.timerSvc.restore();
    if (timer) {
      this.hours.set(timer.hours);
      this.minutes.set(timer.minutes);
      this.seconds.set(timer.seconds);
    }
  }
}
