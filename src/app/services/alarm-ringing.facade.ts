import { computed, inject, Injectable, signal } from "@angular/core";
import { SoundSvc } from "./sound-svc";
import { Alarm } from "../models/alarm.interface";

@Injectable({
    providedIn: 'root'
})
export class AlarmRingingFacade {
    private readonly soundSvc = inject(SoundSvc);

    readonly ringingAlarm = signal<Alarm | null>(null);

    readonly ringing = computed(() => this.ringingAlarm() !== null);

    ring(alarm: Alarm) {
        this.ringingAlarm.set(alarm);
        this.soundSvc.play(alarm.sound);
    }

    stop() {
        this.soundSvc.stop();
        this.ringingAlarm.set(null);
    }

    snooze(minutes: number) {
        const alarm = this.ringingAlarm();
        if (!alarm) return;

        this.stop();

        if (minutes <= 0) return;

        window.setTimeout(() => {
            this.ring(alarm);
        }, minutes * 60_000)
    }
}