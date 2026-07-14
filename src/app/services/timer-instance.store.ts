import { inject, Injectable, signal } from "@angular/core";
import { TimerPreset } from "../core/repositories/timer.repository";
import { TimerInstanceFactory } from "./timer-instance.factory";
import { TimerInstance } from "./timer-instance";

@Injectable({
    providedIn: 'root'
})
export class TimerInstanceStore {
    private readonly factory = inject(TimerInstanceFactory);

    readonly timers = signal<TimerInstance[]>([]);
    readonly active = signal<TimerInstance | null>(null);
    readonly finished = signal<TimerInstance | null>(null);

    add(preset: TimerPreset) {
        const timer = this.factory.create();

        timer.loadPreset(preset);

        timer.engine.onFinished = () => {
            this.finished.set(timer);
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
        this.timers.update(list => list.filter(x => x !== timer));
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
    }
}