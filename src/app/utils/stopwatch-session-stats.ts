import { ConsistencyLabel, EMPTY_STOPWATCH_STATS, Lap, StopwatchSessionStats } from "../core/repositories/stopwatch.repository";

export function calculateSessionStats(laps: Lap[]): StopwatchSessionStats {
    if (!laps.length) {
        return EMPTY_STOPWATCH_STATS;
    }

    const values = laps.map(x => x.lapTime);
    const fastest = Math.min(...values);
    const slowest = Math.max(...values);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce(
        (sum, value) => sum + Math.pow(value - average, 2), 0
    ) / values.length;
    const deviation = Math.sqrt(variance);
    const consistency = Math.max(0, Math.min(100, Math.round(100 - deviation / average * 100)));

    const consistencyLabel: ConsistencyLabel = (() => {
        switch (true) {
            case consistency >= 95:
                return 'excellent';
            case consistency >= 85:
                return 'good';
            case consistency >= 70:
                return 'average';
            default:
                return 'needs-work';
        }
    })()

    return {
        fastestLap: fastest,
        slowestLap: slowest,
        averageLap: Math.round(average),
        consistency,
        consistencyLabel: consistencyLabel
    }
}