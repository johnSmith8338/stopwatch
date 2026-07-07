import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { TimerEngine } from "./timer-engine";
import { SoundSvc, TimerSound } from "./sound-svc";
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
    readonly deleting = signal<TimerPreset | null>(null);
    readonly editing = signal<TimerPreset | null>(null);
    readonly manualSound = signal<TimerSound>('ding');
    currentPreset = signal<TimerPreset | null>(null);

    private restored = false;
    private wasFinished = false;

    readonly title = computed(() => {
        return this.currentPreset()?.title || 'custom timer'
    })

    readonly icon = computed(() => this.currentPreset()?.icon || '⏱');

    private createManualPreset(): TimerPreset {
        return {
            id: 'manual',
            title: 'Manual timer',
            hours: this.hours(),
            minutes: this.minutes(),
            seconds: this.seconds(),
            color: 'transparent',
            icon: '',
            sound: 'ding',
            favorite: false,
            order: 0,
            createdAt: 0,
            updatedAt: 0
        }
    }

    constructor() {
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
            this.sound.play(this.resolveSound(preset));
        })

        void this.restore();
    }

    private resolveSound(timer: TimerPreset): TimerSound {
        if (timer.sound === 'inherit') return this.manualSound();
        return timer.sound;
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
        if (!this.currentPreset()) this.currentPreset.set(this.createManualPreset());
        this.engine.start();
    }

    stop() {
        this.engine.stop();
        this.sound.stop();
        this.dialogOpened.set(false);
    }

    pause() {
        this.engine.pause();
    }

    reset() {
        this.engine.reset();
        this.sound.stop();
        this.currentPreset.set(null);
    }

    updateHours(value: number) {
        this.hours.set(value);
        this.applyDuration();
    }

    updateMinutes(value: number) {
        this.minutes.set(value);
        this.applyDuration();
    }

    updateSeconds(value: number) {
        this.seconds.set(value);
        this.applyDuration();
    }

    updateManualPreset() {
        const preset = this.currentPreset();

        if (!preset || preset.id !== 'manual') return;

        this.currentPreset.update(p => ({
            ...p!,
            hours: this.hours(),
            minutes: this.minutes(),
            seconds: this.seconds()
        }))
    }

    private applyDuration() {
        this.engine.setDuration(
            this.hours(),
            this.minutes(),
            this.seconds()
        );

        this.updateManualPreset();

        void this.timerSvc.save(
            this.hours(),
            this.minutes(),
            this.seconds()
        );
    }

    resetDefault() {
        const defaults = this.engine.getDefaults();

        this.hours.set(defaults.hours);
        this.minutes.set(defaults.minutes);
        this.seconds.set(defaults.seconds);

        this.engine.resetDefault();
        this.currentPreset.set(null);
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

    repeatInDialog() {
        this.sound.stop();
        this.dialogOpened.set(false);
        this.engine.reset();
        this.engine.start();
    }

    stopInDialog() {
        this.engine.stop();
        this.sound.stop();
        this.dialogOpened.set(false);
    }

    requestDelete(timer: TimerPreset) {
        this.deleting.set(timer);
    }

    cancelDelete() {
        this.deleting.set(null);
    }

    async confirmDelete() {
        const timer = this.deleting();
        if (!timer) return;

        await this.presetsSvc.delete(timer.id);
        this.deleting.set(null);
    }
}