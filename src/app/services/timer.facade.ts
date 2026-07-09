import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { TimerEngine } from "./timer-engine";
import { SoundSvc, TimerSound } from "./sound-svc";
import { TimerPreset } from "../core/repositories/timer.repository";
import { TimerPresetsSvc } from "./timer-presets-svc";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { TimerSettingsSvc } from "./timer-settings-svc";
import { TimerAppSettings } from "../core/repositories/timers.repository";
import { TimerInstanceStore } from "./timer-instance.store";
import { PreviewTimerEngine } from "./timer-preview.engine";

@Injectable({
    providedIn: 'root'
})
export class TimerFacade {
    private readonly instance = inject(TimerInstanceStore);
    readonly preview = inject(PreviewTimerEngine);
    readonly presetsSvc = inject(TimerPresetsSvc);
    private readonly settingsSvc = inject(TimerSettingsSvc);
    private readonly sound = inject(SoundSvc);

    readonly dialogOpened = signal(false);
    readonly deleting = signal<TimerPreset | null>(null);
    readonly editing = signal<TimerPreset | null>(null);
    currentPreset = signal<TimerPreset | 'manual' | null>(null);

    private restored = false;
    private wasFinished = false;

    readonly appSettings = computed(() => this.settingsSvc.settings());

    readonly title = computed(() => this.activePreset()?.title || 'timer');

    // readonly icon = computed(() => this.activePreset()?.icon || '⏱');
    readonly icon = computed(() => this.activePreset()?.icon || '');

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

    private requireSettings(): TimerAppSettings {
        const settings = this.appSettings();

        if (!settings) {
            throw new Error('Timer settings are not loaded');
        }

        return settings;
    }

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

        void this.settingsSvc.load();
    }

    private resolveSound(timer: TimerPreset): TimerSound {
        if (timer.sound === 'inherit') return this.requireSettings().sound;
        return timer.sound;
    }

    loadPreset(timer: TimerPreset) {
        this.currentPreset.set(timer);
        this.preview.loadPreset(timer);
    }

    start() {
        if (this.currentPreset() === null) {
            this.currentPreset.set('manual');
        }

        if (!this.settingsSvc.loaded()) return;

        const preset = this.activePreset();
        if (!preset) return;

        this.instance.add(preset);
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

    updateHours(hours: number) {
        this.settingsSvc.patch({ hours });
    }

    updateMinutes(minutes: number) {
        this.settingsSvc.patch({ minutes });
    }

    updateSeconds(seconds: number) {
        this.settingsSvc.patch({ seconds });
    }

    resetDefault() {
        const defaults = this.preview.getDefaults();

        void this.settingsSvc.patch({
            hours: defaults.hours,
            minutes: defaults.minutes,
            seconds: defaults.seconds
        })

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