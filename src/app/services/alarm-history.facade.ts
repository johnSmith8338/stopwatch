import { computed, inject, Injectable } from "@angular/core";
import { AlarmHistorySvc } from "./alarm-history-svc";

@Injectable({
    providedIn: 'root'
})
export class AlarmHistoryFacade {
    private readonly svc = inject(AlarmHistorySvc);

    readonly history = computed(() => this.svc.history());

    clear() {
        return this.svc.clear();
    }
}