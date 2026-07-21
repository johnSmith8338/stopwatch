import { inject, LOCALE_ID } from "@angular/core";
import { AlarmRepeat } from "../models/alarm.interface";

export interface RepeatDay {
    key: AlarmRepeat;
    short: string;
    title: string;
}

const DAYS: AlarmRepeat[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export function buildRepeatDays(): RepeatDay[] {
    const local = inject(LOCALE_ID);
    const shortFormatter = new Intl.DateTimeFormat(local, { weekday: 'narrow' });
    const longFormatter = new Intl.DateTimeFormat(local, { weekday: 'long' });

    return DAYS.map((key, index) => {
        const monday = new Date(2024, 0, 1);
        const current = new Date(monday);
        current.setDate(monday.getDate() + index);

        return {
            key,
            short: shortFormatter.format(current),
            title: longFormatter.format(current)
        }
    })
}