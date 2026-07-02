import { inject, Injectable } from "@angular/core";
import { IndexedDbEngine } from "../storage/indexed-db.engine";
import { DbStore } from "../storage/database";
import { StorageKey } from "../storage/storage-keys";

export interface TimerDefaults {
    hours: number;
    minutes: number;
    seconds: number;
}

@Injectable({
    providedIn: 'root'
})
export class TimersRepository {
    private readonly storage = inject(IndexedDbEngine);

    loadDefaults() {
        return this.storage.get<TimerDefaults>(
            DbStore.Settings,
            StorageKey.TimerDefaults
        )
    }

    saveDefaults(hours: number, minutes: number, seconds: number) {
        return this.storage.set(
            DbStore.Settings,
            StorageKey.TimerDefaults,
            { hours, minutes, seconds }
        )
    }
}