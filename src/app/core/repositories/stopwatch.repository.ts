import { inject, Injectable } from "@angular/core";
import { IndexedDbEngine } from "../storage/indexed-db.engine";
import { DbStore } from "../storage/database";

export interface LapSession {
    id: string;
    startedAt: number;
    finishedAt: number;
    duration: number;
    laps: Lap[];
    stats: StopwatchSessionStats;
}

export interface Lap {
    id: string;
    index: number;
    lapTime: number;
    totalTime: number;
    createdAt: number;
}

export interface StopwatchSessionStats {
    fastestLap: number;
    slowestLap: number;
    averageLap: number;
    consistency: number;
    consistencyLabel: ConsistencyLabel;
}

export type ConsistencyLabel = 'excellent' | 'good' | 'average' | 'needs-work';

export const EMPTY_STOPWATCH_STATS: StopwatchSessionStats = {
    fastestLap: 0,
    slowestLap: 0,
    averageLap: 0,
    consistency: 100,
    consistencyLabel: 'excellent'
};

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

    async restore(history: LapSession[]) {
        await this.clear();
        for (const session of history) {
            await this.save(session);
        }
    }
}