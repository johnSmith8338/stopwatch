import { computed, inject, Injectable } from "@angular/core";
import { AlarmHistorySvc } from "./alarm-history-svc";

@Injectable({
    providedIn: 'root'
})
export class AlarmHistoryFacade {
    private readonly svc = inject(AlarmHistorySvc);

    readonly history = computed(() => this.svc.history());

    readonly total = computed(() => this.history().length);
    readonly rings = computed(() => this.history().filter(h => h.status === 'ring').length);
    readonly stops = computed(() => this.history().filter(h => h.status === 'stop').length);
    readonly snoozes = computed(() => this.history().filter(h => h.status === 'snooze').length);
    readonly missed = computed(() => this.history().filter(h => h.status === 'missed').length);

    clear() {
        return this.svc.clear();
    }
}