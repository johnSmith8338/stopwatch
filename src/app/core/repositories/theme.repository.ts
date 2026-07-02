import { inject, Injectable } from "@angular/core";
import { IndexedDbEngine } from "../storage/indexed-db.engine";
import { DbStore } from "../storage/database";
import { StorageKey } from "../storage/storage-keys";

export type ThemeTYpe = 'light' | 'dark';

@Injectable({
    providedIn: 'root',
})
export class ThemeRepository {
    private readonly storage = inject(IndexedDbEngine);

    load() {
        return this.storage.get<ThemeTYpe>(
            DbStore.Settings,
            StorageKey.Theme
        )
    }

    save(theme: ThemeTYpe) {
        return this.storage.set(
            DbStore.Settings,
            StorageKey.Theme,
            theme
        )
    }
}