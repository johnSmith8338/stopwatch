import { inject, Injectable } from "@angular/core";
import { StorageEngine } from "../storage/storage-engine";
import { AlarmHistoryItem } from "../../models/alarm-history.interface";
import { DbStore } from "../storage/database";
import { StorageKey } from "../storage/storage-keys";

@Injectable({
    providedIn: 'root'
})
export class AlarmHistoryRepository {
    private readonly storage = inject(StorageEngine);

    async load(): Promise<AlarmHistoryItem[]> {
        return (
            await this.storage.get<AlarmHistoryItem[]>(
                DbStore.Alarms,
                StorageKey.AlarmHistory
            )
        ) ?? [];
    }

    async save(history: AlarmHistoryItem[]) {
        await this.storage.set(
            DbStore.Alarms,
            StorageKey.AlarmHistory,
            history
        )
    }

    async clear() {
        await this.storage.delete(
            DbStore.Alarms,
            StorageKey.AlarmHistory
        )
    }
}