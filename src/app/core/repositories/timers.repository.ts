import { inject, Injectable } from "@angular/core";
import { IndexedDbEngine } from "../storage/indexed-db.engine";
import { DbStore } from "../storage/database";
import { StorageKey } from "../storage/storage-keys";
import { TimerColor } from "../../constants/colors";
import { TimerIcon } from "../../constants/icons";
import { TimerSound } from "../../services/sound-svc";

export interface TimerAppSettings {
    hours: number;
    minutes: number;
    seconds: number;
    color: TimerColor;
    icon: TimerIcon;
    sound: TimerSound;
}

@Injectable({
    providedIn: 'root'
})
export class TimersRepository {
    private readonly storage = inject(IndexedDbEngine);

    loadSettings() {
        return this.storage.get<TimerAppSettings>(
            DbStore.Settings,
            StorageKey.TimerAppSettings
        )
    }

    saveSettings(settings: TimerAppSettings) {
        return this.storage.set(
            DbStore.Settings,
            StorageKey.TimerAppSettings,
            settings
        )
    }
}