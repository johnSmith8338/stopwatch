import { computed, inject, Injectable } from "@angular/core";
import { AlarmHistorySvc } from "./alarm-history-svc";
import { AlarmSvc } from "./alarm-svc";
import { AlarmWorkspaceFacade } from "./alarm-workspace.facade";
import { AlarmListFacade } from "./alarm-list.facade";
import { AlarmHistoryGroup, AlarmHistoryItem, AlarmHistorySession } from "../models/alarm-history.interface";

@Injectable({
    providedIn: 'root'
})
export class AlarmHistoryFacade {
    private readonly svc = inject(AlarmHistorySvc);
    private readonly alarmSvc = inject(AlarmSvc);
    private readonly workspace = inject(AlarmWorkspaceFacade);
    private readonly list = inject(AlarmListFacade);

    readonly history = computed(() => this.svc.history());

    readonly total = computed(() => this.history().length);

    readonly rings = computed(() =>
        this.history().filter(h => h.status === 'ring').length);

    readonly stops = computed(() =>
        this.history().filter(h => h.status === 'stop').length);

    readonly snoozes = computed(() =>
        this.history().filter(h => h.status === 'snooze').length);

    readonly missed = computed(() =>
        this.history().filter(h => h.status === 'missed').length);

    readonly groupedHistory = computed(() => {

        const sessionMap = new Map<string, AlarmHistorySession>();

        for (const item of this.history()) {

            let session = sessionMap.get(item.sessionId);

            if (!session) {

                session = {
                    sessionId: item.sessionId,
                    title: item.snapshot.title,
                    snapshot: item.snapshot,
                    startedAt: item.fireAt,
                    events: []
                };

                sessionMap.set(item.sessionId, session);
            }

            session.events.push(item);
        }

        const sessions = [...sessionMap.values()]
            .sort((a, b) => b.startedAt - a.startedAt);

        const now = new Date();

        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();

        const yesterday = today - 86_400_000;
        const week = today - 86_400_000 * 7;

        const groups: AlarmHistoryGroup[] = [];

        const todayItems =
            sessions.filter(s => s.startedAt >= today);

        const yesterdayItems =
            sessions.filter(s =>
                s.startedAt >= yesterday &&
                s.startedAt < today
            );

        const weekItems =
            sessions.filter(s =>
                s.startedAt >= week &&
                s.startedAt < yesterday
            );

        const olderItems =
            sessions.filter(s => s.startedAt < week);

        if (todayItems.length) {
            groups.push({
                title: 'today',
                sessions: todayItems
            });
        }

        if (yesterdayItems.length) {
            groups.push({
                title: 'yesterday',
                sessions: yesterdayItems
            });
        }

        if (weekItems.length) {
            groups.push({
                title: 'this week',
                sessions: weekItems
            });
        }

        if (olderItems.length) {
            groups.push({
                title: 'older',
                sessions: olderItems
            });
        }

        return groups;

    })

    clear() {
        return this.svc.clear();
    }

    reuse(session: AlarmHistorySession) {
        const alarm = this.alarmSvc.createAlarm();

        alarm.title = session.snapshot.title;
        alarm.hour = session.snapshot.hour;
        alarm.minute = session.snapshot.minute;
        alarm.sound = session.snapshot.sound;
        alarm.repeat = [];
        alarm.groupId = null;

        this.workspace.loadAlarm(alarm);
        this.list.openEditor();
    }
}