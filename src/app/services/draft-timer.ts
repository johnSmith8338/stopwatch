import { computed, inject, Injectable, signal } from "@angular/core";
import { PreviewTimerEngine } from "./timer-preview.engine";
import { TimerPreset } from "../core/repositories/timer.repository";
import { TimerSettingsSvc } from "./timer-settings-svc";
import { TimerAppSettings } from "../core/repositories/timers.repository";

@Injectable({
    providedIn: 'root'
})
export class DraftTimer {
    readonly engine = inject(PreviewTimerEngine);
    private readonly settings = inject(TimerSettingsSvc);

    readonly preset = signal<TimerPreset | 'manual' | null>(null);

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
        const settings = this.settings.settings();
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
}