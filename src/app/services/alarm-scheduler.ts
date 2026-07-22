import { Alarm, AlarmRepeat } from "../models/alarm.interface";

export interface AlarmScheduleResult {
    alarm: Alarm;
    fireAt: Date;
}

const WEEK_DAYS: AlarmRepeat[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export class AlarmScheduler {
    nextOccurrence(alarm: Alarm, now = new Date()): Date | null {
        if (!alarm.enabled) return null;
        return alarm.repeat.length ?
            this.nextRepeated(alarm, now) :
            this.nextOneShot(alarm, now);
    }

    nextAlarm(alarms: Alarm[], now = new Date()): AlarmScheduleResult | null {
        let next: AlarmScheduleResult | null = null;

        for (const alarm of alarms) {
            const fireAt = this.nextOccurrence(alarm, now);
            if (!fireAt) continue;

            if (!next || fireAt < next.fireAt) {
                next = { alarm, fireAt };
            }
        }
        return next;
    }

    private nextOneShot(alarm: Alarm, now: Date): Date {
        const candidate = new Date(now);

        candidate.setHours(
            alarm.hour,
            alarm.minute,
            0,
            0
        )

        if (candidate <= now) candidate.setDate(candidate.getDate() + 1);
        return candidate;
    }

    private nextRepeated(alarm: Alarm, now: Date): Date {
        for (let offset = 0; offset < 7; offset++) {
            const candidate = new Date(now);
            candidate.setDate(now.getDate() + offset);
            const day = WEEK_DAYS[candidate.getDay()];

            if (!alarm.repeat.includes(day)) continue;

            candidate.setHours(
                alarm.hour,
                alarm.minute,
                0,
                0
            )

            if (candidate > now) return candidate;
        }

        const candidate = new Date(now);
        candidate.setDate(now.getDate() + 7);
        candidate.setHours(
            alarm.hour,
            alarm.minute,
            0,
            0
        )

        return candidate;
    }
}