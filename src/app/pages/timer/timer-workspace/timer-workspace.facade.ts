import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { SoundSvc, TimerSound } from "../../../services/sound-svc";
import { TimerInstanceStore } from "../../../services/timer-instance.store";
import { PreviewTimerEngine } from "../../../services/timer-preview.engine";
import { TimerSettingsSvc } from "../../../services/timer-settings-svc";
import { TimerPreset } from "../../../core/repositories/timer.repository";
import { TimerAppSettings } from "../../../core/repositories/timers.repository";
import { TimerColor } from "../../../constants/colors";
import { TimerIcon } from "../../../constants/icons";

@Injectable({
    providedIn: 'root'
})
export class TimerWorkspaceFacade {
    readonly preview = inject(PreviewTimerEngine);
    readonly settings = inject(TimerSettingsSvc);
    readonly instance = inject(TimerInstanceStore);
    readonly sound = inject(SoundSvc);

    private wasFinished = false;

    currentPreset = signal<TimerPreset | 'manual' | null>(null);
    readonly dialogOpened = signal(false);

    readonly title = computed(() => this.activePreset()?.title || 'timer');

    // readonly icon = computed(() => this.activePreset()?.icon || '⏱');
    readonly icon = computed(() => this.activePreset()?.icon || '');

    readonly appSettings = computed(() => this.settings.settings());

    private requireSettings(): TimerAppSettings {
        const settings = this.appSettings();
        if (!settings) throw new Error('Timer settings are not loaded');
        return settings;
    }

    readonly controls = {
        running: this.preview.running,
        start: () => this.start(),
        pause: () => this.pause(),
        stop: () => this.stop(),
        reset: () => this.reset(),
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

    readonly activePreset = computed<TimerPreset | null>(() => {
        const preset = this.currentPreset();
        if (preset === null) return null;
        if (preset === 'manual') return this.manualPreset();
        return preset;
    })

    constructor() {
        effect(() => {
            const finished = this.preview.finished();
            if (!finished || this.wasFinished) {
                this.wasFinished = finished;
                return;
            };

            this.wasFinished = true;

            const preset = this.activePreset();
            if (!preset) return;

            this.dialogOpened.set(true);
            this.sound.play(this.resolveSound(preset));
        })

        void this.settings.load();
    }

    private resolveSound(timer: TimerPreset): TimerSound {
        if (timer.sound === 'inherit') return this.requireSettings().sound;
        return timer.sound;
    }

    start() {
        if (this.currentPreset() === null) {
            this.currentPreset.set('manual');
        }

        if (!this.settings.loaded()) {
            return;
        }

        const preset = this.activePreset();
        if (!preset) {
            return;
        }

        const timer = this.instance.add(preset);
    }

    stop() {
        this.sound.stop();
        this.dialogOpened.set(false);

        const s = this.requireSettings();
        this.preview.reset();
        this.preview.setDuration(
            s.hours,
            s.minutes,
            s.seconds
        )
    }

    pause() {
        this.preview.pause();
    }

    reset() {
        this.preview.reset();
        this.sound.stop();
        this.currentPreset.set(null);
    }

    resetDefault() {
        const defaults = this.preview.getDefaults();

        void this.settings.patch({
            hours: defaults.hours,
            minutes: defaults.minutes,
            seconds: defaults.seconds
        })

        this.currentPreset.set(null);
    }

    updateHours(hours: number) {
        this.settings.patch({ hours });
    }

    updateMinutes(minutes: number) {
        this.settings.patch({ minutes });
    }

    updateSeconds(seconds: number) {
        this.settings.patch({ seconds });
    }

    updateColor(color: TimerColor) {
        this.settings.patch({ color });
    }

    updateIcon(icon: TimerIcon) {
        this.settings.patch({ icon });
    }

    updateSound(sound: TimerSound) {
        this.settings.patch({ sound });
    }

    loadPreset(timer: TimerPreset) {
        this.currentPreset.set(timer);
        this.preview.loadPreset(timer);
    }

    closeDialog() {
        this.dialogOpened.set(false);
        this.sound.stop();
    }

    repeatInDialog() {
        this.sound.stop();
        this.dialogOpened.set(false);
        this.preview.reset();
        this.preview.start();
    }

    stopInDialog() {
        this.sound.stop();
        this.dialogOpened.set(false);

        const s = this.requireSettings();
        this.preview.reset();
        this.preview.setDuration(
            s.hours,
            s.minutes,
            s.seconds
        )
    }
}