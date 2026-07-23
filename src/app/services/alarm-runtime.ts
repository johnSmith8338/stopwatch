import { DestroyRef, effect, inject, Injectable } from "@angular/core";
import { AlarmSvc } from "./alarm-svc";
import { AlarmEngine } from "./alarm-engine";
import { AlarmRingingFacade } from "./alarm-ringing.facade";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({
    providedIn: 'root'
})
export class AlarmRuntime {
    private readonly destroyRef = inject(DestroyRef);

    private readonly svc = inject(AlarmSvc);
    private readonly engine = inject(AlarmEngine);
    private readonly ringing = inject(AlarmRingingFacade);

    constructor() {
        effect(() => {
            this.engine.start(this.svc.alarms());
        })

        this.engine.fired$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(alarm => {
            this.ringing.ring(alarm);
        })

        effect(() => {
            if (this.ringing.ringing()) {
                this.engine.stop();
                return;
            }
            this.engine.start(this.svc.alarms())
        })
    }
}