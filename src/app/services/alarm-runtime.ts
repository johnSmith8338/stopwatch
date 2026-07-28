import { DestroyRef, effect, inject, Injectable } from "@angular/core";
import { AlarmSvc } from "./alarm-svc";
import { AlarmEngine } from "./alarm-engine";
import { AlarmRingingFacade } from "./alarm-ringing.facade";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AlarmHistorySvc } from "./alarm-history-svc";

@Injectable({
    providedIn: 'root'
})
export class AlarmRuntime {
    private readonly destroyRef = inject(DestroyRef);
    private readonly history = inject(AlarmHistorySvc);

    private readonly svc = inject(AlarmSvc);
    private readonly engine = inject(AlarmEngine);
    private readonly ringing = inject(AlarmRingingFacade);

    constructor() {
        effect(() => {
            this.engine.start(this.svc.alarms());
        })

        this.engine.fired$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(async ({ alarm, resumed }) => {

            await this.ringing.ring(alarm, resumed);

            if (!resumed) {
                await this.history.add(
                    this.ringing.currentSessionId()!,
                    alarm,
                    'ring'
                );
            }

            if (!alarm.repeat.length) {
                void this.svc.disableAlarm(alarm.id);
            }
        });

        effect(() => {
            if (this.ringing.ringing()) {
                this.engine.stop();
                return;
            }
            this.engine.start(this.svc.alarms())
        })

        this.ringing.stopped$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(async ({ alarm, sessionId }) => {
            await this.history.add(
                sessionId,
                alarm,
                'stop'
            );
            this.engine.start(this.svc.alarms());
        });

        this.ringing.snoozed$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(async ({ alarm, sessionId, minutes }) => {
            await this.history.add(
                sessionId,
                alarm,
                'snooze',
                minutes
            );
            this.engine.snooze(alarm, minutes);
        });

        this.ringing.missed$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(async ({ alarm, sessionId }) => {
            await this.history.add(
                sessionId,
                alarm,
                'missed'
            );
            this.ringing.notifyMissedAlarm(alarm);
            this.engine.start(this.svc.alarms());
        });
    }
}