import { computed, inject, Injectable } from "@angular/core";
import { AlarmHistorySvc } from "./alarm-history-svc";
import { TimerHistorySvc } from "./timer-history-svc";
import { StopwatchHistorySvc } from "./stopwatch-history-svc";
import { getConsistencyLabel } from "../utils/stopwatch-session-stats";

@Injectable({
    providedIn: 'root'
})
export class DashboardFacade {
    private readonly alarmHistory = inject(AlarmHistorySvc);
    private readonly timerHistory = inject(TimerHistorySvc);
    private readonly stopwatchHistory = inject(StopwatchHistorySvc);

    readonly alarms = computed(() => this.alarmHistory.history());
    readonly timers = computed(() => this.timerHistory.history());
    readonly stopwatchSessions = computed(() => this.stopwatchHistory.history());

    readonly totalAlarmRuns = computed(() => this.alarms().length);
    readonly totalTimerRuns = computed(() => this.timers().length);
    readonly totalStopwatchSessions = computed(() => this.stopwatchSessions().length);

    readonly alarmStats = computed(() => {
        const history = this.alarmHistory.history();

        return {
            total: history.length,
            stopped: history.filter(x => x.status === 'stop').length,
            snoozed: history.filter(x => x.status === 'snooze').length,
            missed: history.filter(x => x.status === 'missed').length,
        }
    })

    readonly timerStats = computed(() => {
        const history = this.timerHistory.history();

        return {
            total: history.length,
            finished: history.filter(x => x.status === 'finished').length,
            cancelled: history.filter(x => x.status === 'cancelled').length
        }
    })

    readonly stopwatchStats = computed(() => {
        const sessions = this.stopwatchHistory.history();
        const validSessions = sessions.filter(s => s.laps.length > 0);
        const totalSessions = sessions.length;
        const totalLaps = sessions.reduce((sum, s) => sum + s.laps.length, 0);
        const longestSession = sessions.length ? Math.max(
            ...sessions.map(s => s.duration)
        ) : 0;
        const longestLap = sessions.length ? Math.max(
            0, ...sessions.flatMap(s =>
                s.laps.map(i => i.lapTime)
            )
        ) : 0;
        const averageLaps = totalSessions ? Math.round(totalLaps / totalSessions * 10) / 10 : 0;
        const averageConsistency = validSessions.length ?
            Math.round(validSessions.reduce(
                (sum, s) => sum + s.stats.consistency, 0
            ) / validSessions.length) : 100;
        const consistencyLabel = getConsistencyLabel(averageConsistency);

        return {
            totalSessions,
            totalLaps,
            longestSession,
            longestLap,
            averageLaps,
            averageConsistency,
            consistencyLabel
        }
    })
}