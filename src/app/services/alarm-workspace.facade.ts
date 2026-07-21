import { computed, inject, Injectable } from "@angular/core";
import { DraftAlarm } from "./draft-alarm";
import { Alarm } from "../models/alarm.interface";

@Injectable({
    providedIn: 'root'
})
export class AlarmWorkspaceFacade {
    readonly draft = inject(DraftAlarm);

    readonly alarm = computed(() => this.draft.alarm());

    loadAlarm(alarm: Alarm) {
        this.draft.loadAlarm(alarm);
    }

    clear() {
        this.draft.clear();
    }
}