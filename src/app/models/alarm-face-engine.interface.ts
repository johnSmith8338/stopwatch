import { Signal } from "@angular/core";

export interface AlarmFaceEngine {
    hour: Signal<number>;
    minute: Signal<number>;
}