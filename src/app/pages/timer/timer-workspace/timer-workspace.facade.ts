import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { SoundSvc, TimerSound } from "../../../services/sound-svc";
import { TimerInstanceStore } from "../../../services/timer-instance.store";
import { PreviewTimerEngine } from "../../../services/timer-preview.engine";
import { TimerSettingsSvc } from "../../../services/timer-settings-svc";
import { TimerPreset } from "../../../core/repositories/timer.repository";
import { TimerAppSettings } from "../../../core/repositories/timers.repository";
import { TimerColor } from "../../../constants/colors";
import { TimerIcon } from "../../../constants/icons";
import { DraftTimer } from "../../../services/draft-timer";

@Injectable({
    providedIn: 'root'
})
export class TimerWorkspaceFacade {
    readonly draft = inject(DraftTimer);
    readonly settings = inject(TimerSettingsSvc);
    readonly instance = inject(TimerInstanceStore);
    readonly sound = inject(SoundSvc);

    private wasFinished = false;

    readonly dialogOpened = signal(false);

    readonly appSettings = computed(() => this.settings.settings());

    readonly controls = {
        running: this.draft.engine.running(),
        start: () => this.start(),
        pause: () => this.pause(),
        stop: () => this.stop(),
        reset: () => this.reset(),
    }

    constructor() {
        effect(() => {
            const finished = this.draft.engine.finished();
            if (!finished || this.wasFinished) {
                this.wasFinished = finished;
                return;
            };

            this.wasFinished = true;

            const preset = this.draft.activePreset();
            if (!preset) return;

            this.dialogOpened.set(true);
            this.sound.play(this.resolveSound(preset));
        })

        void this.settings.load();
    }

    private resolveSound(timer: TimerPreset): TimerSound {
        if (timer.sound === 'inherit') return this.draft.requireSettings().sound;
        return timer.sound;
    }

    start() {
        if (this.draft.preset() === null) {
            this.draft.loadManual();
        }

        // if (!this.settings.loaded()) return;

        const preset = this.draft.activePreset();
        if (!preset) return;

        this.instance.add(preset);
    }

    stop() {
        this.sound.stop();
        this.dialogOpened.set(false);

        const s = this.draft.requireSettings();
        this.draft.reset();
        this.draft.engine.setDuration(
            s.hours,
            s.minutes,
            s.seconds
        )
    }

    pause() {
        this.draft.pause();
    }

    reset() {
        this.draft.reset();
        this.sound.stop();
        this.draft.preset.set(null);
    }

    resetDefault() {
        const defaults = this.draft.engine.getDefaults();

        void this.settings.patch({
            hours: defaults.hours,
            minutes: defaults.minutes,
            seconds: defaults.seconds
        })

        this.draft.preset.set(null);
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
        this.draft.loadPreset(timer);
    }

    closeDialog() {
        this.dialogOpened.set(false);
        this.sound.stop();
    }

    repeatInDialog() {
        this.sound.stop();
        this.dialogOpened.set(false);
        this.draft.reset();
        this.draft.start();
    }

    stopInDialog() {
        this.sound.stop();
        this.dialogOpened.set(false);

        const s = this.draft.requireSettings();
        this.draft.reset();
        this.draft.engine.setDuration(
            s.hours,
            s.minutes,
            s.seconds
        )
    }
}