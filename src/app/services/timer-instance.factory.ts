import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from "@angular/core";
import { TimerInstance } from "./timer-instance";

@Injectable({
    providedIn: 'root'
})
export class TimerInstanceFactory {
    private injector = inject(EnvironmentInjector);

    create() {
        return runInInjectionContext(
            this.injector,
            () => new TimerInstance()
        )
    }
}