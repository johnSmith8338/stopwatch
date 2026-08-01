import { HistoryRetentionDays } from "../models/settings.model";

const DAY_MS = 86_400_000;

export function cleanupHistory<T>(
    items: T[],
    retention: HistoryRetentionDays,
    getTimestamp: (item: T) => number
): T[] {
    if (retention === -1) return items;

    const limit = Date.now() - retention * DAY_MS;

    return items.filter(item => getTimestamp(item) >= limit);
}