import { inject, Injectable, signal } from "@angular/core";
import { TimerPreset } from "../core/repositories/timer.repository";
import { TimerInstanceFactory } from "./timer-instance.factory";
import { TimerInstance } from "./timer-instance";
import { DEFAULT_TIMER_SOUND, SoundSvc } from "./sound-svc";
import { TimerHistoryItem } from "../models/timer-history.model";

@Injectable({
    providedIn: 'root'
})
export class TimerInstanceStore {
    private readonly factory = inject(TimerInstanceFactory);
    private readonly soundSvc = inject(SoundSvc);

    readonly timers = signal<TimerInstance[]>([]);
    readonly active = signal<TimerInstance | null>(null);
    readonly finished = signal<TimerInstance | null>(null);

    add(preset: TimerPreset) {
        const timer = this.factory.create();

        timer.loadPreset(preset);

        const previousFinished = timer.engine.onFinished;

        timer.engine.onFinished = async () => {
            await previousFinished?.();
            this.finished.set(timer);
            this.soundSvc.play(timer.activePreset()?.sound ?? DEFAULT_TIMER_SOUND);
        }

        timer.start();

        this.timers.update(list => {
            const next = [...list, timer];
            return next;
        });

        this.active.set(timer);

        return timer;
    }

    remove(timer: TimerInstance) {
        timer.stop();
        this.timers.update(list => list.filter(x => x !== timer));
        if (this.active() === timer) this.active.set(null);
        if (this.finished() === timer) this.finished.set(null);
    }

    select(timer: TimerInstance) {
        this.active.set(timer);
    }

    clearFinished() {
        this.finished.set(null);
    }

    repeat(timer: TimerInstance) {
        timer.reset();
        timer.start();
        this.finished.set(null);
    }

    stop(timer: TimerInstance) {
        timer.stop();
        this.remove(timer);
        this.finished.set(null);
        this.soundSvc.stop();
    }

    runFromHistory(item: TimerHistoryItem) {
        const timer = this.factory.create();

        timer.engine.setDuration(
            item.snapshot.hours,
            item.snapshot.minutes,
            item.snapshot.seconds,
        )

        if (item.elapsedMs < item.durationMs) {
            timer.engine.remainingMs.set(item.durationMs - item.elapsedMs);
        }

        timer.start();
        this.timers.update(list => [...list, timer]);
        this.active.set(timer);

        return timer;
    }
}