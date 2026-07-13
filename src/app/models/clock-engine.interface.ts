import { Signal } from "@angular/core";
import { TimerPreset } from "../core/repositories/timer.repository";

export interface ClockEngine {
    readonly running: Signal<boolean>;
    readonly displayTime: Signal<string>;

    start(): void;
    pause(): void;
    stop(): void;
    reset(): void;
}

export interface PresetClockEngine extends ClockEngine {
    loadPreset(preset: TimerPreset): void;
    finished: Signal<boolean>;
    setDuration(
        hours: number,
        minutes: number,
        seconds: number
    ): void;
}