import { inject, Injectable } from "@angular/core";
import { StopwatchEngine } from "./stopwatch-engine";
import { StopwatchHistorySvc } from "./stopwatch-history-svc";

@Injectable({
    providedIn: 'root'
})
export class StopwatchFacade {
    readonly engine = inject(StopwatchEngine);
    private readonly history = inject(StopwatchHistorySvc);

    start() {
        this.history.startSession();
        this.engine.start();
    }

    pause() {
        this.engine.pause();
    }

    async stop() {
        const lastLap = this.engine.finishLap();
        if (lastLap) {
            await this.history.addLap(
                lastLap.lapTime,
                lastLap.totalTime
            )
        }
        await this.history.finishSession(this.engine.elapsedMs());
        this.engine.stop();
    }

    reset() {
        this.engine.reset();
    }

    async lap() {
        const lap = this.engine.lap();
        await this.history.addLap(
            lap.lapTime,
            lap.totalTime
        )
    }
}