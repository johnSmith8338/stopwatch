import { Injectable } from "@angular/core";
import { AlarmScheduler, AlarmScheduleResult } from "./alarm-scheduler";
import { Alarm } from "../models/alarm.interface";

@Injectable({
    providedIn: 'root'
})
export class AlarmEngine {
    private readonly scheduler = new AlarmScheduler();
    private timeoutId: number | null = null;
    private current: AlarmScheduleResult | null = null;

    start(alarms: Alarm[]) {
        this.stop();
        this.current = this.scheduler.nextAlarm(alarms);
        if (!this.current) return;

        const delay = this.current.fireAt.getTime() - Date.now();
        this.timeoutId = window.setTimeout(() => this.fire(), Math.max(delay, 0));
    }

    stop() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.current = null;
    }

    private fire() {
        if (!this.current) return;
        console.log('ALARM!!!', this.current.alarm.title, this.current.fireAt);
    }
}