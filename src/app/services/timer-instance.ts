import { DestroyRef, effect, inject, signal } from "@angular/core";
import { TimerEngine } from "./timer-engine";
import { TimerPreset } from "../core/repositories/timer.repository";
import { TimerSound } from "./sound-svc";

export class TimerInstance {
    private readonly destroyRef = inject(DestroyRef);

    readonly id = crypto.randomUUID();
    readonly startedAt = Date.now();
    readonly engine = new TimerEngine();
    readonly preset = signal<TimerPreset | null>(null);
    readonly finished = signal(false);

    constructor() {
        effect(() => {
            if (this.engine.finished()) return;
            this.finished.set(true);
        })

        this.destroyRef.onDestroy(() => {
            this.engine.stop();
        })
    }

    loadPreset(preset: TimerPreset) {
        this.preset.set(preset);
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

    sound(): TimerSound {
        return this.preset()?.sound ?? 'none';
    }
}