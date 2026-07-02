import { inject, Injectable } from '@angular/core';
import { ThemeSvc } from './theme-svc';
import { TimerSvc } from './timer-svc';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerSvc {
  private readonly themeSvc = inject(ThemeSvc);
  private readonly timerSvc = inject(TimerSvc);

  async initialize(): Promise<void> {
    await Promise.all([
      this.themeSvc.restore(),
    ])
  }
}
