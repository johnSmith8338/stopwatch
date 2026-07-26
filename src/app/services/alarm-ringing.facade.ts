import { computed, inject, Injectable, signal } from "@angular/core";
import { SoundSvc } from "./sound-svc";
import { Alarm } from "../models/alarm.interface";
import { WakeLockSvc } from "./wake-lock-svc";
import { NotificationSvc } from "./notification-svc";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AlarmRingingFacade {
    private readonly soundSvc = inject(SoundSvc);
    private readonly wakelock = inject(WakeLockSvc);
    private readonly notification = inject(NotificationSvc);

    readonly stopped$ = new Subject<Alarm>();
    readonly snoozed$ = new Subject<{ alarm: Alarm, minutes: number }>();
    readonly missed$ = new Subject<Alarm>();

    private missedTimer: number | null = null;

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

        this.missedTimer = window.setTimeout(() => {
            const current = this.ringingAlarm();
            if (!current) return;

            this.soundSvc.stop();
            void this.wakelock.release();
            this.ringingAlarm.set(null);
            this.missed$.next(current);
            // 2 minutes ringing -> nobody clicked -> missed
        }, 2 * 60_000);
    }

    async stop() {
        const alarm = this.ringingAlarm();
        if (!alarm) return;

        if (this.missedTimer !== null) {
            clearTimeout(this.missedTimer);
            this.missedTimer = null;
        }

        this.soundSvc.stop();
        await this.wakelock.release();
        this.ringingAlarm.set(null);

        this.stopped$.next(alarm);
    }

    async snooze(minutes: number) {
        const alarm = this.ringingAlarm();
        if (!alarm) return;

        if (this.missedTimer !== null) {
            clearTimeout(this.missedTimer);
            this.missedTimer = null;
        }

        this.soundSvc.stop();
        await this.wakelock.release();

        // if (minutes <= 0) return;

        // window.setTimeout(() => {
        //     this.ring(alarm);
        // }, minutes * 60_000)

        this.ringingAlarm.set(null);
        this.snoozed$.next({ alarm, minutes });
    }

    notifyMissedAlarm(alarm: Alarm) {
        this.notification.show({
            title: 'missed alarm',
            body: `${alarm.title}\n` +
                `${alarm.hour.toString().padStart(2, '0')}:` +
                `${alarm.minute.toString().padStart(2, '0')}`,
            requireInteraction: false
        })
    }
}