import { effect, inject, Injectable, signal } from "@angular/core";
import { TimerEngine } from "./timer-engine";
import { SoundSvc } from "./sound-svc";
import { TimerPreset } from "../core/repositories/timer.repository";
import { TimerPresetsSvc } from "./timer-presets-svc";
import { TimerSvc } from "./timer-svc";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Injectable({
    providedIn: 'root'
})
export class TimerFacade {
    readonly engine = inject(TimerEngine);
    readonly presetsSvc = inject(TimerPresetsSvc);
    private readonly timerSvc = inject(TimerSvc);
    private readonly sound = inject(SoundSvc);

    readonly hours = signal(this.engine.defaultHours);
    readonly minutes = signal(this.engine.defaultMinutes);
    readonly seconds = signal(this.engine.defaultSeconds);
    readonly dialogOpened = signal(false);
    readonly editing = signal<TimerPreset | null>(null);
    currentPreset = signal<TimerPreset | null>(null);

    private restored = false;
    private wasFinished = false;

    constructor() {
        effect(() => {
            if (!this.restored) return;

            const hours = this.hours();
            const minutes = this.minutes();
            const seconds = this.seconds();

            this.engine.setDuration(hours, minutes, seconds)

            void this.timerSvc.save(hours, minutes, seconds)
        })

        effect(() => {
            const finished = this.engine.finished();
            if (!finished || this.wasFinished) {
                this.wasFinished = finished;
                return;
            };

            this.wasFinished = true;

            const preset = this.currentPreset();
            if (!preset) return;

            this.dialogOpened.set(true);
            this.sound.play(preset.sound ?? 'ding');
        })

        void this.restore();
    }

    private async restore() {
        const timer = await this.timerSvc.restore();
        if (timer) {
            this.hours.set(timer.hours);
            this.minutes.set(timer.minutes);
            this.seconds.set(timer.seconds);
        }

        this.restored = true;
    }

    loadPreset(timer: TimerPreset) {
        this.currentPreset.set(timer);
        this.hours.set(timer.hours);
        this.minutes.set(timer.minutes);
        this.seconds.set(timer.seconds);
        this.engine.loadPreset(timer);
    }

    start() {
        this.engine.start();
    }

    stop() {
        this.engine.stop();
        this.sound.stop();
    }

    pause() {
        this.engine.pause();
    }

    reset() {
        this.engine.reset();
        this.sound.stop();
    }

    updateHours(value: number) {
        this.hours.set(value);
    }

    updateMinutes(value: number) {
        this.minutes.set(value);
    }

    updateSeconds(value: number) {
        this.seconds.set(value);
    }

    resetDefault() {
        const defaults = this.engine.getDefaults();

        this.hours.set(defaults.hours);
        this.minutes.set(defaults.minutes);
        this.seconds.set(defaults.seconds);

        this.engine.resetDefault();
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
        this.editing.set(null);
    }

    async deletePreset(id: string) {
        await this.presetsSvc.delete(id);
    }

    async toggleFavorite(timer: TimerPreset) {
        await this.presetsSvc.toggleFavorite(timer);
    }

    async showAll() {
        this.presetsSvc.filter.set('all');
    }

    async showFavorites() {
        this.presetsSvc.filter.set('favorite');
    }

    search(text: string) {
        this.presetsSvc.search.set(text);
    }

    searchChanged(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.search(value);
    }

    async reorder(event: CdkDragDrop<TimerPreset[]>) {
        if (event.previousIndex === event.currentIndex) return;

        await this.presetsSvc.reorder(
            event.previousIndex,
            event.currentIndex
        )
    }

    closeDialog() {
        this.dialogOpened.set(false);
        this.sound.stop();
    }

    repeat() {
        this.sound.stop();
        this.dialogOpened.set(false);
        this.engine.reset();
        this.engine.start();
    }
}