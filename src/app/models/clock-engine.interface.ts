import { Signal } from "@angular/core";

export interface ClockEngine {
    readonly running: Signal<boolean>;
    readonly displayTime: Signal<string>;

    start(): void;
    pause(): void;
    stop(): void;
    reset(): void;
}