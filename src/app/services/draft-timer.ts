import { computed, inject, Injectable, signal } from "@angular/core";
import { PreviewTimerEngine } from "./timer-preview.engine";
import { TimerPreset } from "../core/repositories/timer.repository";
import { TimerSettingsSvc } from "./timer-settings-svc";
import { TimerAppSettings } from "../core/repositories/timers.repository";
import { TimerColor } from "../constants/colors";
import { TimerIcon } from "../constants/icons";
import { TimerSound } from "./sound-svc";

@Injectable({
    providedIn: 'root'
})
export class DraftTimer {
    readonly engine = inject(PreviewTimerEngine);
    private readonly settingsSvc = inject(TimerSettingsSvc);

    readonly preset = signal<TimerPreset | 'manual' | null>(null);

    readonly settings = computed(() => this.settingsSvc.settings());

    readonly title = computed(() => {
        const preset = this.preset();
        if (!preset) return 'timer';
        if (preset === 'manual') return 'manual timer';

        return preset.title;
    });

    readonly icon = computed(() => {
        const preset = this.preset();
        if (!preset) return '';
        if (preset === 'manual') return '';

        return preset.icon;
    });

    readonly running = computed(() => this.engine.running());

    requireSettings(): TimerAppSettings {
        const settings = this.settings();
        if (!settings) throw new Error('Timer settings are not loaded');
        return settings;
    }

    readonly manualPreset = computed<TimerPreset>(() => {
        const s = this.requireSettings();
        return {
            id: 'manual',
            title: 'manual timer',
            hours: s.hours,
            minutes: s.minutes,
            seconds: s.seconds,
            color: s.color,
            icon: s.icon,
            sound: s.sound,
            favorite: false,
            order: 0,
            createdAt: 0,
            updatedAt: 0
        }
    })

    readonly activePreset = computed(() => {
        const preset = this.preset();
        if (preset === null) return null;
        if (preset === 'manual') return this.manualPreset();
        return preset;
    })

    private applySettings() {
        const s = this.requireSettings();
        this.engine.setDuration(
            s.hours,
            s.minutes,
            s.seconds
        )
    }

    loadPreset(preset: TimerPreset) {
        this.preset.set(preset);
        this.engine.loadPreset(preset);
    }

    loadManual() {
        const preset = this.manualPreset();
        this.preset.set('manual');
        this.engine.loadPreset(preset);
    }

    start() {
        this.engine.start();
    }

    pause() {
        this.engine.pause();
    }

    stop() {
        this.engine.stop();
    }

    reset() {
        this.engine.reset();
    }

    resetDefault() {
        this.engine.resetDefault();
    }

    resetToDefault() {
        const defaults = this.engine.getDefaults();

        void this.settingsSvc.patch({
            hours: defaults.hours,
            minutes: defaults.minutes,
            seconds: defaults.seconds
        })

        this.preset.set(null);
    }

    restore() {
        this.reset();
        this.applySettings();
    }

    clear() {
        this.reset();
        this.preset.set(null);
    }

    restart() {
        this.reset();
        this.start();
    }

    updateHours(hours: number) {
        void this.settingsSvc.patch({ hours });
    }

    updateMinutes(minutes: number) {
        void this.settingsSvc.patch({ minutes });
    }

    updateSeconds(seconds: number) {
        void this.settingsSvc.patch({ seconds });
    }

    updateColor(color: TimerColor) {
        void this.settingsSvc.patch({ color });
    }

    updateIcon(icon: TimerIcon) {
        void this.settingsSvc.patch({ icon });
    }

    updateSound(sound: TimerSound) {
        void this.settingsSvc.patch({ sound });
    }

    setHours(value: number) {
        this.updateHours(Math.max(0, value));
    }

    setMinutes(value: number) {
        this.updateMinutes(Math.min(59, Math.max(0, value)));
    }

    setSeconds(value: number) {
        this.updateSeconds(Math.min(59, Math.max(0, value)));
    }
}