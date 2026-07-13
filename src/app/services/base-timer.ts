import { computed, signal } from "@angular/core";
import { PresetClockEngine } from "../models/clock-engine.interface";
import { TimerPreset } from "../core/repositories/timer.repository";

export abstract class BaseTimer<T extends PresetClockEngine = PresetClockEngine> {
    abstract readonly engine: T;
    readonly preset = signal<TimerPreset | 'manual' | null>(null);

    readonly running = computed(() => this.engine.running());

    readonly activePreset = computed(() => {
        const preset = this.preset();
        if (preset === null) return null;
        return preset === 'manual' ? null : preset;
    })

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