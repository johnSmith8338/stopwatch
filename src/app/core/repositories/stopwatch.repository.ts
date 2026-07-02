import { inject, Injectable } from "@angular/core";
import { IndexedDbEngine } from "../storage/indexed-db.engine";
import { DbStore } from "../storage/database";

export interface LapSession {
    id: string;
    startedAt: number;
    finishedAt: number;
    duration: number;
    laps: Lap[];
}

export interface Lap {
    id: string;
    index: number;
    lapTime: number;
    totalTime: number;
    createdAt: number;
}

@Injectable({
    providedIn: 'root'
})
export class StopwatchRepository {
    private readonly storage = inject(IndexedDbEngine);

    save(session: LapSession) {
        return this.storage.set(
            DbStore.Sessions,
            session.id,
            session
        )
    }

    delete(id: string) {
        return this.storage.delete(
            DbStore.Sessions,
            id
        )
    }

    getAll() {
        return this.storage.getAll<LapSession>(
            DbStore.Sessions
        )
    }

    clear() {
        return this.storage.clear(
            DbStore.Sessions
        )
    }
}