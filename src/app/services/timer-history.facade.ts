import { computed, inject, Injectable } from "@angular/core";
import { TimerHistorySvc } from "./timer-history-svc";
import { TimerHistoryGroup, TimerHistoryItem } from "../models/timer-history.model";
import { TimerInstanceStore } from "./timer-instance.store";

@Injectable({
    providedIn: 'root'
})
export class TimerHistoryFacade {
    private readonly svc = inject(TimerHistorySvc);
    private readonly store = inject(TimerInstanceStore);

    readonly history = computed(() => this.svc.history());
    readonly total = computed(() => this.history().length);
    readonly finished = computed(() =>
        this.history().filter(x => x.status === 'finished').length
    )

    readonly cancelled = computed(() =>
        this.history().filter(x => x.status === 'cancelled').length
    )

    readonly groupedHistory = computed(() => {
        const now = new Date();

        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        ).getTime();

        const yesterday = today - 86_400_000;
        const week = today - 7 * 86_400_000;

        const history = this.history();
        const groups: TimerHistoryGroup[] = [];

        const addGroup = (title: string, items: TimerHistoryItem[]) => {
            if (!items.length) return;
            groups.push({ title, items });
        }

        addGroup('today', history.filter(x => x.finishedAt >= today));
        addGroup('yesterday', history.filter(x => x.finishedAt >= yesterday && x.finishedAt < today));
        addGroup('this week', history.filter(x => x.finishedAt >= week && x.finishedAt < yesterday));
        addGroup('older', history.filter(x => x.finishedAt < week));

        return groups;
    })

    clear() {
        return this.svc.clear();
    }

    run(item: TimerHistoryItem) {
        this.store.runFromHistory(item);
    }
}