import { computed, signal } from "@angular/core";
import { PresetClockEngine } from "../models/clock-engine.interface";
import { TimerPreset } from "../core/repositories/timer.repository";
import { DEFAULT_TIMER_ICON } from "../constants/icons";

export abstract class BaseTimer<T extends PresetClockEngine = PresetClockEngine> {
    abstract readonly engine: T;
    readonly preset = signal<TimerPreset | null>(null);

    readonly running = computed(() => this.engine.running());

    readonly activePreset = computed(() => this.preset());

    readonly title = computed(() => this.preset()?.title ?? 'timer');

    readonly icon = computed(() => this.preset()?.icon ?? DEFAULT_TIMER_ICON);

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

    loadPreset(preset: TimerPreset) {
        this.engine.loadPreset(preset);
        this.preset.set(preset);
    }
}