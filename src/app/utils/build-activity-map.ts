import { ActivityDay, ActivityWeek } from "../models/dashboard";

const DAY_MS = 86_400_000;

export function buildActivityMap(timestamps: number[], days: 84): ActivityDay[] {
    const today = Math.floor(Date.now() / DAY_MS);
    const counts = new Map<number, number>();

    for (const ts of timestamps) {
        const day = Math.floor(ts / DAY_MS);
        counts.set(
            day,
            (counts.get(day) ?? 0) + 1
        );
    }

    const result: ActivityDay[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const day = today - i;
        const count = counts.get(day) ?? 0;
        let level: ActivityDay['level'];
        switch (true) {
            case count === 0:
                level = 0;
                break;
            case count < 3:
                level = 1;
                break;
            case count < 6:
                level = 2;
                break;
            case count < 10:
                level = 3;
                break;
            default:
                level = 4;
        }
        result.push({
            day,
            date: day * DAY_MS,
            count,
            level
        })
    }

    return result;
}

export function groupActivityWeeks(days: ActivityDay[]): ActivityWeek[] {
    const result: ActivityWeek[] = [];
    let previousMonth = -1;

    for (let i = 0; i < days.length; i += 7) {
        const week = days.slice(i, i + 7);
        const date = new Date(week[0].date);
        const month = date.getMonth();

        const label = month !== previousMonth
            ? date.toLocaleString(undefined, { month: 'short' })
            : '';

        previousMonth = month;

        result.push({
            label,
            days: week
        })
    }

    return result;
}