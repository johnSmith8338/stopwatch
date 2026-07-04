import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { TimerEngine } from '../../services/timer-engine';
import { Controls } from "../../components/controls/controls";
import { DigitalDisplay } from "../../components/digital-display/digital-display";
import { WheelPicker } from "../../components/wheel-picker/wheel-picker";
import { TimerFace } from "../../components/timer-face/timer-face";
import { TimerSvc } from '../../services/timer-svc';
import { TimerPresetList } from "../../components/timer-preset-list/timer-preset-list";
import { TimerPresetsSvc } from '../../services/timer-presets-svc';
import { TimerPreset } from '../../core/repositories/timer.repository';
import { TimerPresetEditor } from "../../components/timer-preset-editor/timer-preset-editor";
import { DurationPicker } from "../../components/duration-picker/duration-picker";

@Component({
  selector: 'app-timer',
  imports: [Controls, DigitalDisplay, TimerFace, TimerPresetList, TimerPresetEditor, DurationPicker],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timer {
  readonly engineSvc = inject(TimerEngine);
  private readonly timerSvc = inject(TimerSvc);
  private readonly presetsSvc = inject(TimerPresetsSvc);

  readonly hours = signal(this.engineSvc.defaultHours);
  readonly minutes = signal(this.engineSvc.defaultMinutes);
  readonly seconds = signal(this.engineSvc.defaultSeconds);
  readonly editing = signal<TimerPreset | null>(null);
  readonly presets = signal<TimerPreset[]>([]);

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
    await this.reloadPresets();
    this.restored = true;
  }

  private async reloadPresets() {
    this.presets.set(await this.presetsSvc.getAll());
  }

  createPreset() {
    this.editing.set(this.presetsSvc.create());
  }

  editPreset(timer: TimerPreset) {
    this.editing.set(structuredClone(timer));
  }

  cancelEditing() {
    this.editing.set(null);
  }

  async savePreset(timer: TimerPreset) {
    await this.presetsSvc.save(timer);
    await this.reloadPresets();
    this.editing.set(null);
  }

  async deletePreset(id: string) {
    await this.presetsSvc.delete(id);
    await this.reloadPresets();
  }

  startPreset(timer: TimerPreset) {
    this.engineSvc.loadPreset(timer);
    this.hours.set(timer.hours);
    this.minutes.set(timer.minutes);
    this.seconds.set(timer.seconds);
  }

  async toggleFavorite(timer: TimerPreset) {
    await this.presetsSvc.toggleFavorite(timer);
    await this.reloadPresets();
  }

  async showAll() {
    this.presetsSvc.filter.set('all');
    await this.reloadPresets();
  }

  async showFavorites() {
    this.presetsSvc.filter.set('favorite');
    await this.reloadPresets();
  }

  async searchChanged(event: Event) {
    this.presetsSvc.search.set((event.target as HTMLInputElement).value);
    await this.reloadPresets();
  }
}
