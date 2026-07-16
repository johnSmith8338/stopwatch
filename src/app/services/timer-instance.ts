import { DestroyRef, inject, signal } from "@angular/core";
import { TimerEngine } from "./timer-engine";
import { TimerSound } from "./sound-svc";
import { BaseTimer } from "./base-timer";

export class TimerInstance extends BaseTimer<TimerEngine> {
    private readonly destroyRef = inject(DestroyRef);

    readonly id = crypto.randomUUID();
    readonly startedAt = Date.now();
    override readonly engine = new TimerEngine();
    readonly finished = signal(false);

    constructor() {
        super();

        this.destroyRef.onDestroy(() => {
            this.engine.stop();
        })
    }

    sound(): TimerSound {
        return this.activePreset()?.sound ?? 'none';
    }
}