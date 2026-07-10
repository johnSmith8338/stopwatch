import { Injectable, signal } from '@angular/core';
import { TimerPreset } from '../core/repositories/timer.repository';

@Injectable({
  providedIn: 'root',
})
export class CurrentTimerSvc {
  readonly select = signal<TimerPreset | 'manual' | null>(null);
}
