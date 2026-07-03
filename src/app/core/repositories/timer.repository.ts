import { inject, Injectable } from "@angular/core";
import { IndexedDbEngine } from "../storage/indexed-db.engine";
import { DbStore } from "../storage/database";

export interface TimerPreset {
    id: string;
    title: string;
    hours: number;
    minutes: number;
    seconds: number;
    color?: string;
    favorite: boolean;
    createdAt: number;
    updatedAt: number;
}

@Injectable({
    providedIn: 'root'
})
export class TimerRepository {
    private readonly storage = inject(IndexedDbEngine);

    getAll() {
        return this.storage.getAll<TimerPreset>(
            DbStore.Timers
        )
    }

    save(timer: TimerPreset) {
        return this.storage.set(
            DbStore.Timers,
            timer.id,
            timer
        )
    }

    delete(id: string) {
        return this.storage.delete(
            DbStore.Timers,
            id
        )
    }

    clear() {
        return this.storage.clear(
            DbStore.Timers
        )
    }
}