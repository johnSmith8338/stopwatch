import { inject, Injectable } from "@angular/core";
import { StorageEngine } from "../storage/storage-engine";
import { AppSettings } from "../../models/settings.model";
import { DbStore } from "../storage/database";
import { StorageKey } from "../storage/storage-keys";

@Injectable({
    providedIn: 'root'
})
export class SettingsRepository {
    private readonly storage = inject(StorageEngine);

    async load(): Promise<AppSettings> {
        return (
            await this.storage.get<AppSettings>(
                DbStore.Settings,
                StorageKey.Settings
            )
        ) ?? {
            theme: 'light',
            historyRetentionDays: 30
        }
    }

    async save(settings: AppSettings) {
        await this.storage.set(
            DbStore.Settings,
            StorageKey.Settings,
            settings
        )
    }
}