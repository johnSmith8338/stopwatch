import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { SoundSvc, TimerSound } from "../../../services/sound-svc";
import { TimerInstanceStore } from "../../../services/timer-instance.store";
import { TimerSettingsSvc } from "../../../services/timer-settings-svc";
import { TimerPreset } from "../../../core/repositories/timer.repository";
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

    readonly controls = this.draft;

    constructor() {
        void this.settings.load();
    }

    running() {
        return this.draft.running();
    }

    start() {
        if (this.draft.preset() === null) {
            this.draft.loadManual();
        }

        const preset = this.draft.activePreset();
        if (!preset) return;

        this.instance.add(preset);
    }

    stop() {
        this.sound.stop();
        this.dialogOpened.set(false);
        this.draft.restore();
    }

    pause() {
        this.draft.pause();
    }

    reset() {
        this.sound.stop();
        this.draft.clear();
    }

    resetDefault() {
        this.draft.resetToDefault();
    }

    loadPreset(timer: TimerPreset) {
        this.draft.loadPreset(timer);
    }

    startPreset(timer: TimerPreset) {
        this.instance.add(timer);
    }
}