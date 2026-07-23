import { computed, inject, Injectable, signal } from "@angular/core";
import { SoundSvc } from "./sound-svc";
import { Alarm } from "../models/alarm.interface";
import { WakeLockSvc } from "./wake-lock-svc";
import { NotificationSvc } from "./notification-svc";

@Injectable({
    providedIn: 'root'
})
export class AlarmRingingFacade {
    private readonly soundSvc = inject(SoundSvc);
    private readonly wakelock = inject(WakeLockSvc);
    private readonly notification = inject(NotificationSvc);

    readonly ringingAlarm = signal<Alarm | null>(null);

    readonly ringing = computed(() => this.ringingAlarm() !== null);

    async ring(alarm: Alarm) {
        this.ringingAlarm.set(alarm);

        await this.wakelock.acquire();

        this.notification.show({
            title: alarm.title,
            body: `
                ${alarm.hour.toString().padStart(2, '0')}:
                ${alarm.minute.toString().padStart(2, '0')}
                `
        })

        this.soundSvc.play(alarm.sound);
    }

    async stop() {
        this.soundSvc.stop();
        await this.wakelock.release();
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