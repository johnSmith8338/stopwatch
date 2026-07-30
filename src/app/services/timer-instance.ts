import { DestroyRef, inject, signal } from "@angular/core";
import { TimerEngine } from "./timer-engine";
import { TimerSound } from "./sound-svc";
import { BaseTimer } from "./base-timer";
import { TimerHistorySvc } from "./timer-history-svc";

export class TimerInstance extends BaseTimer<TimerEngine> {
    private readonly destroyRef = inject(DestroyRef);
    private readonly history = inject(TimerHistorySvc);

    readonly id = crypto.randomUUID();
    readonly startedAt = signal(0);
    override readonly engine = new TimerEngine();
    readonly finished = signal(false);

    constructor() {
        super();

        this.engine.onFinished = async () => {
            this.finished.set(true);
            await this.history.add(this, 'finished');
        }

        this.destroyRef.onDestroy(() => {
            this.engine.stop();
        })
    }

    override start() {
        this.startedAt.set(Date.now());
        super.start();
    }

    override async stop() {
        if (this.engine.running()) await this.history.add(this, 'stopped');
        super.stop();
    }

    cancel() {
        if (this.engine.running()) void this.history.add(this, 'cancelled');
        this.engine.stop();
    }

    sound(): TimerSound {
        return this.activePreset()?.sound ?? 'none';
    }
}