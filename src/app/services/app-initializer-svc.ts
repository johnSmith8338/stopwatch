import { inject, Injectable } from '@angular/core';
import { ThemeSvc } from './theme-svc';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerSvc {
  private readonly themeSvc = inject(ThemeSvc);

  async initialize(): Promise<void> {
    await Promise.all([
      this.themeSvc.restore(),
    ])
  }
}
