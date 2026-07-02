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
        this.engine.stop();
        await this.history.finishSession(this.engine.elapsedMs());
    }

    reset() {
        this.engine.reset();
    }

    async lap() {
        console.log('Facade lap');
        const lap = this.engine.lap();
        await this.history.addLap(
            lap.lapTime,
            lap.totalTime
        )
    }
}